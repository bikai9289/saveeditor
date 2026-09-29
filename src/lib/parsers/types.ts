export type ParserEngine =
    | 'rpgmaker'
    | 'generic';

export type FormatFamily =
    | 'rpgmaker'
    | 'generic-structured'
    | 'generic-binary';

export type RoundTripSupportLevel = 'stable' | 'stable-limited' | 'experimental' | 'none';

export type FailureReasonCode =
    | 'ok'
    | 'parse_failed'
    | 'unsupported_extension'
    | 'unsupported_binary'
    | 'unsupported_ruby_marshal'
    | 'raw_fallback'
    | 'unsupported_container'
    | 'encrypted_or_unsupported_container'
    | 'likely_encrypted_container'
    | 'restricted_write_scope'
    | 'decompression_limit'
    | 'decompression_failed';

export interface ParserCapability {
    canView: boolean;
    canEdit: boolean;
    canSave: boolean;
    requiresExperimental: boolean;
    roundTripSupport: RoundTripSupportLevel;
}

export interface ParseOutcome<TData = unknown> {
    engine: ParserEngine;
    format: string;
    formatFamily?: FormatFamily;
    mode: string;
    reasonCode: FailureReasonCode | string;
    reason?: string;
    capabilities: ParserCapability;
    data: TData;
    warnings?: string[];
    diagnostics?: Record<string, unknown> & { supportPack?: SupportPackSummary };
}

export interface SupportPackSummary {
    fileName: string;
    extension: string;
    sizeBucket: string;
    parserPath: string;
    failureStage: string;
    reasonCode: string;
    format: string;
    mode: string;
    capability: RoundTripSupportLevel;
    canView: boolean;
    canEdit: boolean;
    canSave: boolean;
    contentClass: 'structured' | 'text' | 'binary' | 'empty';
    signature: {
        byteHash: string;
        schemaFingerprint: string;
    };
    structureSummary: {
        rootType: string;
        nodeCount: number;
        primitiveCount: number;
        maxDepth: number;
    };
}

export function makeCapabilities(input: Partial<ParserCapability>): ParserCapability {
    return {
        canView: input.canView ?? false,
        canEdit: input.canEdit ?? false,
        canSave: input.canSave ?? false,
        requiresExperimental: input.requiresExperimental ?? false,
        roundTripSupport: input.roundTripSupport ?? 'none',
    };
}

export function makeOutcome<TData>(
    outcome: Omit<ParseOutcome<TData>, 'capabilities'> & { capabilities?: Partial<ParserCapability> }
): ParseOutcome<TData> {
    return {
        ...outcome,
        capabilities: makeCapabilities(outcome.capabilities || {}),
    };
}
