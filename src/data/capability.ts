import type { FormatFamily, ParserEngine, RoundTripSupportLevel } from '../lib/parsers/types';

export type SampleKind = 'synthetic-fixture' | 'real-anonymized' | 'structure-only';
export type PrivacyLevel = 'public-fixture' | 'private-regression' | 'structure-only';
export type EvidenceScope = 'engine-core' | 'format-core' | 'game-specific';
export type PresetConfidence = 'verified' | 'candidate' | 'blocked';
export type PresetValueType = 'number' | 'boolean' | 'string';
export type PresetWritePolicy = 'write' | 'persistent-primitive' | 'readonly';
export type PresetActionType = 'set-map-values' | 'add-map-entry' | 'set-primitive';

export interface SampleRecord {
    id: string;
    gameSlug: string;
    engine: ParserEngine;
    format: string;
    platform: string;
    gameVersion: string;
    sampleKind: SampleKind;
    privacyLevel: PrivacyLevel;
    evidenceScope: EvidenceScope;
    appliesTo: string[];
    capability: RoundTripSupportLevel | 'read-only';
    verifiedFeatures: string[];
    reasonCode: string;
    parserTestIds: string[];
    verifiedAt: string;
}

export interface PresetField {
    id: string;
    label: string;
    group: 'Money' | 'Level & XP' | 'Stats' | 'Items' | 'Flags' | 'Unlocks' | 'Inventory';
    pathSelector: string[];
    valueType: PresetValueType;
    writePolicy: PresetWritePolicy;
    aliases: string[];
    confidence: PresetConfidence;
    icon: string;
    description: string;
    min?: number;
    max?: number;
}

export interface PresetAction {
    id: string;
    label: string;
    actionType: PresetActionType;
    targetGroup: PresetField['group'];
    value: number | boolean | string;
    guard: string;
    requiresFolderContext: boolean;
}

export interface GamePreset {
    slug: string;
    engine: ParserEngine;
    formatFamily: FormatFamily;
    fields: PresetField[];
    actions: PresetAction[];
    requiredContext: string[];
    sampleRecordIds: string[];
    limits: string[];
}

export interface ResolvedPreset extends GamePreset {
    confidence: PresetConfidence;
    verifiedFeatures: string[];
    candidateFeatures: string[];
    evidenceScope: EvidenceScope[];
    samples: SampleRecord[];
}

export const sampleRecords: SampleRecord[] = [
    {
        id: 'fixture-rpgmaker-mv-core',
        gameSlug: 'rpg-maker',
        engine: 'rpgmaker',
        format: '.rpgsave/.rmmzsave',
        platform: 'synthetic',
        gameVersion: 'MV/MZ fixture',
        sampleKind: 'synthetic-fixture',
        privacyLevel: 'public-fixture',
        evidenceScope: 'format-core',
        appliesTo: ['rpg-maker'],
        capability: 'stable',
        verifiedFeatures: ['Gold', 'Level', 'EXP', 'HP/MP', 'Items', 'Weapons', 'Armors', 'Variables', 'Switches'],
        reasonCode: 'ok',
        parserTestIds: ['test:parsers:fidelity', 'test:parsers:benchmark'],
        verifiedAt: '2026-05-25',
    },
    {
        id: 'fixture-rpgmaker-ruby-core',
        gameSlug: 'rpg-maker',
        engine: 'rpgmaker',
        format: '.rvdata2/.rvdata/.rxdata',
        platform: 'synthetic',
        gameVersion: 'Ruby Marshal fixture',
        sampleKind: 'synthetic-fixture',
        privacyLevel: 'public-fixture',
        evidenceScope: 'format-core',
        appliesTo: ['rpg-maker'],
        capability: 'stable-limited',
        verifiedFeatures: ['Gold', 'Items', 'Weapons', 'Armors', 'Variables', 'Switches', 'Actor stats'],
        reasonCode: 'ok',
        parserTestIds: ['test:parsers:smoke', 'test:parsers:benchmark'],
        verifiedAt: '2026-05-25',
    },
    {
        id: 'fixture-rpgmaker-lcf-core',
        gameSlug: 'rpg-maker',
        engine: 'rpgmaker',
        format: '.lsd',
        platform: 'synthetic',
        gameVersion: 'RPG Maker 2000/2003 fixture',
        sampleKind: 'synthetic-fixture',
        privacyLevel: 'public-fixture',
        evidenceScope: 'format-core',
        appliesTo: ['rpg-maker'],
        capability: 'stable-limited',
        verifiedFeatures: ['Gold', 'Items', 'Variables', 'Switches', 'Actor stats'],
        reasonCode: 'ok',
        parserTestIds: ['test:parsers:smoke', 'test:parsers:benchmark'],
        verifiedAt: '2026-05-25',
    },
];

const rpgMakerFields: PresetField[] = [
    field('gold', 'Gold / Money', 'Money', ['gold', '_gold'], 'number', 'write', ['gold', 'money'], '$', 'Edit party currency fields.'),
    field('level', 'Level', 'Level & XP', ['level', '_level'], 'number', 'write', ['level', 'lvl'], 'LV', 'Edit actor level fields.'),
    field('exp', 'EXP', 'Level & XP', ['exp', '_exp'], 'number', 'write', ['exp', 'xp'], 'XP', 'Edit actor experience fields.'),
    field('hp', 'HP / MP', 'Stats', ['_hp', '_mp', 'hp', 'mp'], 'number', 'write', ['hp', 'mp', 'health'], 'HP', 'Edit visible HP/MP and parameter fields.'),
    field('items', 'Items / Inventory', 'Items', ['_items', 'items'], 'number', 'write', ['item', 'inventory'], 'IT', 'Edit item quantities by ID or folder names.'),
    field('weapons', 'Weapons', 'Items', ['_weapons', 'weapons'], 'number', 'write', ['weapon'], 'WP', 'Edit weapon quantities where present.'),
    field('armors', 'Armors', 'Items', ['_armors', 'armors'], 'number', 'write', ['armor'], 'AR', 'Edit armor quantities where present.'),
    field('variables', 'Variables', 'Flags', ['_variables', 'variables'], 'number', 'write', ['variable'], 'VAR', 'Edit numeric story variables cautiously.'),
    field('switches', 'Switches / Flags', 'Flags', ['_switches', 'switches'], 'boolean', 'write', ['switch', 'flag'], 'SW', 'Toggle boolean event flags.'),
];

export const gamePresets: GamePreset[] = [
    preset('rpg-maker', 'rpgmaker', 'rpgmaker', rpgMakerFields, ['fixture-rpgmaker-mv-core', 'fixture-rpgmaker-ruby-core', 'fixture-rpgmaker-lcf-core'], ['Folder Mode improves item, actor, variable, and switch labels.']),
];

export function getPreset(slug?: string): ResolvedPreset | undefined {
    if (!slug) return undefined;
    const presetItem = gamePresets.find((item) => item.slug === slug);
    if (!presetItem) return undefined;
    const samples = presetItem.sampleRecordIds
        .map((id) => sampleRecords.find((sample) => sample.id === id))
        .filter(Boolean) as SampleRecord[];
    const sampleFeatures = Array.from(new Set(samples.flatMap((sample) => sample.verifiedFeatures)));
    const evidenceScope = Array.from(new Set(samples.map((sample) => sample.evidenceScope)));
    return {
        ...presetItem,
        confidence: 'verified',
        verifiedFeatures: sampleFeatures,
        candidateFeatures: [],
        evidenceScope,
        samples,
    };
}

export function getPresetEditableItems(slug?: string) {
    const presetItem = getPreset(slug);
    if (!presetItem) return null;
    return presetItem.fields.map((item) => ({
        icon: item.icon,
        name: item.label,
        desc: item.description,
    }));
}

export function getPresetQuickTargets(slug?: string): string[] | null {
    const presetItem = getPreset(slug);
    if (!presetItem) return null;
    return presetItem.fields.map((item) => item.label);
}

export function getCoverageRows() {
    return gamePresets.map((presetItem) => {
        const resolved = getPreset(presetItem.slug)!;
        return {
            slug: resolved.slug,
            engine: resolved.engine,
            family: resolved.formatFamily,
            confidence: resolved.confidence,
            realSampleCount: resolved.samples.filter((sample) => sample.sampleKind === 'real-anonymized').length,
            syntheticFixtureCount: resolved.samples.filter((sample) => sample.sampleKind === 'synthetic-fixture').length,
            structureOnlyCount: resolved.samples.filter((sample) => sample.sampleKind === 'structure-only').length,
            sampleCount: resolved.samples.length,
            latest: resolved.samples.map((sample) => sample.verifiedAt).sort().at(-1) || 'pending',
            capability: resolved.samples.some((sample) => sample.capability === 'stable')
                ? 'stable'
                : resolved.samples.some((sample) => sample.capability === 'stable-limited')
                    ? 'stable-limited'
                    : 'read-only',
            verifiedFeatures: resolved.verifiedFeatures,
            candidateFeatures: resolved.candidateFeatures,
            evidenceScope: resolved.evidenceScope,
            limits: resolved.limits,
        };
    });
}

function field(
    id: string,
    label: PresetField['label'],
    group: PresetField['group'],
    pathSelector: string[],
    valueType: PresetValueType,
    writePolicy: PresetWritePolicy,
    aliases: string[],
    icon: string,
    description: string
): PresetField {
    return { id, label, group, pathSelector, valueType, writePolicy, aliases, confidence: 'verified', icon, description };
}

function preset(
    slug: string,
    engine: ParserEngine,
    formatFamily: FormatFamily,
    fields: PresetField[],
    sampleRecordIds: string[],
    limits: string[]
): GamePreset {
    return {
        slug,
        engine,
        formatFamily,
        fields,
        actions: defaultActions(),
        requiredContext: ['Game folder or Data files recommended'],
        sampleRecordIds,
        limits,
    };
}

function defaultActions(): PresetAction[] {
    return [
        { id: 'set-gold', label: 'Gold', actionType: 'set-primitive', targetGroup: 'Money', value: 0, guard: 'party-currency-only', requiresFolderContext: false },
        { id: 'set-level', label: 'Level', actionType: 'set-primitive', targetGroup: 'Level & XP', value: 1, guard: 'actor-level-only', requiresFolderContext: false },
        { id: 'set-exp', label: 'EXP', actionType: 'set-primitive', targetGroup: 'Level & XP', value: 0, guard: 'actor-exp-only', requiresFolderContext: false },
        { id: 'set-hp-mp', label: 'HP / MP', actionType: 'set-primitive', targetGroup: 'Stats', value: 1, guard: 'actor-stats-only', requiresFolderContext: false },
        { id: 'all-items-99', label: 'All Items 99', actionType: 'set-map-values', targetGroup: 'Items', value: 99, guard: 'inventory-map-only', requiresFolderContext: false },
        { id: 'add-item', label: 'Add Item by ID/name', actionType: 'add-map-entry', targetGroup: 'Items', value: 99, guard: 'item-map-only', requiresFolderContext: false },
        { id: 'set-weapons-99', label: 'All Weapons 99', actionType: 'set-map-values', targetGroup: 'Items', value: 99, guard: 'weapon-map-only', requiresFolderContext: false },
        { id: 'set-armors-99', label: 'All Armors 99', actionType: 'set-map-values', targetGroup: 'Items', value: 99, guard: 'armor-map-only', requiresFolderContext: false },
        { id: 'set-variable', label: 'Variable', actionType: 'set-primitive', targetGroup: 'Flags', value: 0, guard: 'variable-entry-only', requiresFolderContext: false },
        { id: 'set-switch', label: 'Switch', actionType: 'set-primitive', targetGroup: 'Flags', value: true, guard: 'switch-entry-only', requiresFolderContext: false },
    ];
}
