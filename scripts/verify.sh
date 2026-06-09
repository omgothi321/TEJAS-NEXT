#!/bin/bash
echo "Running Local Quality Gates..."
npm audit --production --audit-level=moderate || exit 1
npm install --save-dev eslint madge
npx eslint . --max-warnings=0 || exit 1
npx madge --circular src/ || exit 1
npm test || exit 1
echo "All local quality gates passed!"
