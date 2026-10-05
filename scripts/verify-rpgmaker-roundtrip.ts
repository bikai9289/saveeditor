import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import LZString from 'lz-string';
import { parseRPGMakerMV, buildRPGMakerMV } from '../src/lib/parsers/rpgmaker';

// Supply locally generated saves; do not redistribute game assets or private saves.
const paths = process.argv.slice(2);
assert.ok(paths.length, 'Usage: npx tsx scripts/verify-rpgmaker-roundtrip.ts <save> [save...]');
for (const path of paths) {
    const file = new File([await readFile(path)], basename(path));
    const original = await parseRPGMakerMV(file);
    assert.equal(original.capabilities.canSave, true);
    const sourceKeys = original.diagnostics?.originalRootKeys as string[];
    const exported = await buildRPGMakerMV(file, original.data);
    const rebuilt = await parseRPGMakerMV(new File([exported], file.name));
    assert.deepEqual(rebuilt.data, original.data, 'No-op export must preserve every field');
    assert.deepEqual([...(rebuilt.diagnostics?.originalRootKeys as string[])].sort(), [...sourceKeys].sort(), 'Export must not inject UI fields');
    const edited = structuredClone(original.data);
    edited.party._gold = 98765;
    const changedBlob = await buildRPGMakerMV(file, edited);
    const changed = await parseRPGMakerMV(new File([changedBlob], file.name));
    assert.equal(changed.data?.party._gold, 98765);
    changed.data!.party._gold = original.data!.party._gold;
    changed.data!.gold = original.data!.gold;
    assert.deepEqual(changed.data, original.data, 'Gold edit must preserve all other fields');
    console.log(`PASS ${file.name}: no-op and gold-only round trips`);
}
// Native top-level fields must survive even when their names match UI aliases.
const native = { gold: 7, level: 3, items: { '1': 2 }, custom: { '@a': [null, 4], '@c': 1 } };
const file = new File([LZString.compressToBase64(JSON.stringify(native))], 'native.rpgsave');
const parsed = await parseRPGMakerMV(file);
const output = await buildRPGMakerMV(file, parsed.data);
assert.deepEqual(JSON.parse(LZString.decompressFromBase64(await output.text())!), native);
console.log('PASS native root fields and JsonEx metadata preserved');
