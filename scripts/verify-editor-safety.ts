import assert from 'node:assert/strict';
import { parseSaveFile } from '../src/lib/parseSaveFile';
import { buildRejectedSupportPack, supportPackMailto } from '../src/lib/supportPack';

const legacyFile = new File(['legacy save bytes'], 'renamed.rpgsave');
const legacyResult = await parseSaveFile(legacyFile, 'rpg-maker-mz');
assert.equal(legacyResult.outcome.reasonCode, 'unsupported_extension');
assert.equal(legacyResult.outcome.capabilities.canView, false);

const sensitiveValue = 'PRIVATE_SAVE_CONTENT_SHOULD_NOT_BE_IN_EMAIL';
const supportPack = buildRejectedSupportPack({
    file: new File(['bytes'], 'broken.rmmzsave'),
    parserPath: 'rpgmaker',
    failureStage: 'parse_failed',
    reasonCode: 'parse_failed',
    data: { secret: sensitiveValue },
    headerBytes: new Uint8Array([1, 2, 3]),
});
const mailto = supportPackMailto(supportPack);
assert.equal(mailto.includes(sensitiveValue), false);

console.log('Editor safety checks passed.');
