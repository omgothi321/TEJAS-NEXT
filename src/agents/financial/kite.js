'use strict';

/**
 * Tejas Kite Agent — Official KiteConnect SDK
 * Uses kiteconnect npm package — NO scraping, NO ToS violation
 * Setup: developers.kite.trade → Personal (Free) → Redirect: http://127.0.0.1:5000/callback
 */

const { KiteConnect } = require('kiteconnect');
const http            = require('http');
const url             = require('url');
const { execFile }    = require('child_process');
const path            = require('path');
const os              = require('os');
const fs              = require('fs-extra');

class KiteAgent {
  constructor() {
    this.apiKey    = process.env.ZERODHA_API_KEY;
    this.apiSecret = process.env.ZERODHA_API_SECRET;
    this.kite      = null;
    this.ready     = false;
  }

  async initialize() {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('Add ZERODHA_API_KEY and ZERODHA_API_SECRET to .env\nGet them from: developers.kite.trade');
    }
    this.kite = new KiteConnect({ api_key: this.apiKey });

    const token = process.env.ZERODHA_ACCESS_TOKEN;
    if (token) {
      this.kite.setAccessToken(token);
      this.ready = true;
      console.log('[Kite] ✅ Connected');
      return;
    }
    await this._browserLogin();
  }

  async _browserLogin() {
    const loginUrl = this.kite.getLoginURL();
    console.log('\n[Kite] Opening Zerodha login...');
    console.log('[Kite] URL:', loginUrl);
    try { execFile('xdg-open', [loginUrl]); } catch {}

    console.log('[Kite] Waiting for login (5 min timeout)...\n');
    const requestToken = await new Promise((resolve, reject) => {
      const server = http.createServer((req, res) => {
        const parsed = url.parse(req.url, true);
        if (parsed.pathname === '/callback' && parsed.query.request_token) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end('<h1 style="font-family:sans-serif;text-align:center;margin-top:100px">✅ Tejas: Login successful!<br>You can close this tab.</h1>');
          server.close();
          resolve(parsed.query.request_token);
        } else {
          res.writeHead(404); res.end();
        }
      });
      server.listen(5000, () => console.log('[Kite] Callback server ready on :5000'));
      setTimeout(() => { server.close(); reject(new Error('Login timeout — 5 minutes')); }, 300000);
    });

    const session = await this.kite.generateSession(requestToken, this.apiSecret);
    this.kite.setAccessToken(session.access_token);
    this.ready = true;

    // Save token hint for user
    console.log('\n[Kite] ✅ Login successful!');
    console.log('[Kite] Add to .env to skip login tomorrow:');
    console.log('ZERODHA_ACCESS_TOKEN=' + session.access_token + '\n');
  }

  async getQuote(symbol) {
    this._checkReady();
    const key  = `NSE:${symbol.toUpperCase()}`;
    const data = (await this.kite.getQuote([key]))[key];
    return {
      symbol:     symbol.toUpperCase(),
      price:      data.last_price,
      open:       data.ohlc.open,
      high:       data.ohlc.high,
      low:        data.ohlc.low,
      close:      data.ohlc.close,
      change_pct: ((data.last_price - data.ohlc.close) / data.ohlc.close * 100).toFixed(2) + '%',
      volume:     data.volume,
      timestamp:  new Date().toISOString()
    };
  }

  async getPortfolio() {
    this._checkReady();
    return (await this.kite.getHoldings()).map(h => ({
      symbol:    h.tradingsymbol,
      qty:       h.quantity,
      avg_price: h.average_price,
      current:   h.last_price,
      pnl:       h.pnl.toFixed(2),
      pnl_pct:   ((h.pnl / (h.average_price * h.quantity)) * 100).toFixed(2) + '%'
    }));
  }

  async getPositions() {
    this._checkReady();
    return (await this.kite.getPositions()).net;
  }

  async getOrders() {
    this._checkReady();
    return this.kite.getOrders();
  }

  isMarketOpen() {
    const ist = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const day = ist.getDay();
    if (day === 0 || day === 6) return false;
    const mins = ist.getHours() * 60 + ist.getMinutes();
    return mins >= 555 && mins <= 930; // 9:15 AM to 3:30 PM IST
  }

  // PAPER TRADE ONLY — never executes real order
  async paperTrade(symbol, qty, action) {
    this._checkReady();
    const quote = await this.getQuote(symbol);
    const result = {
      symbol, qty,
      action:    action.toUpperCase(),
      price:     quote.price,
      total:     '₹' + (quote.price * qty).toFixed(2),
      status:    'PAPER_TRADE — NOT EXECUTED',
      market:    this.isMarketOpen() ? 'OPEN' : 'CLOSED',
      timestamp: new Date().toISOString()
    };
    console.log('\n[Kite] ⚠️  PAPER TRADE (no real order placed)');
    console.log(`  ${action.toUpperCase()} ${qty} × ${symbol} @ ₹${quote.price} = ${result.total}`);
    return result;
  }

  _checkReady() {
    if (!this.ready) throw new Error('Kite not initialized. Call initialize() first.');
  }
}

module.exports = KiteAgent;
