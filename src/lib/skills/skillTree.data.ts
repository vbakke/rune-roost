export type UiGate = `gate:${string}`;

export const skillTree = {
    encoding: {
        'encoding.roman': {
            label: 'Roman alphabet',
            description: 'Our journey starts with the 23 letters of the Roman alphabet'
        },
        'encoding.ascii': {
            label: 'ASCII',
            dependsOn: ['encoding.roman']
        },
        'encoding.bytes': {
            label: 'Bytes',
            dependsOn: ['encoding.ascii']
        },
        'encoding.hex': {
            label: 'Hexadecimal',
            dependsOn: ['encoding.bytes']
        },
        'encoding.base64': {
            label: 'Base64',
            dependsOn: ['encoding.bytes']
        },
        'encoding.unicode': {
            label: 'Unicode',
            dependsOn: ['encoding.ascii']
        }
    },
    symmetric: {
        'sym.encrypt': {
            label: 'Encrypt text'
        },
        'sym.decrypt': {
            label: 'Decrypt',
            dependsOn: ['sym.encrypt'],
        },
        'sym.block_size': {
            label: 'Encrypt with AES',
            dependsOn: ['sym.decrypt']
        },
        'sym.aes': {
            label: 'Encrypt with AES',
            dependsOn: ['sym.decrypt', 'encoding.bytes']
        },
        'sym.aes.decrypt': {
            label: 'Decrypt with AES',
            dependsOn: ['sym.aes.encrypt']
        }
    },
    asymmetric: {
        'asym.encrypt.simple': {
            label: 'Encrypt'
        },
        'asym.decrypt.simple': {
            label: 'Decrypt',
            dependsOn: ['asym.encrypt.simple'],
        },
        'asym.encrypt.num': {
            label: 'Encrypt numbers using RSA',
            dependsOn: ['asym.decrypt'],
        },

    },
    hashing: {
        'hashing.caesar_sum': {
            label: 'Cross sum using Caesar cipher',
            description: 'In this simple example of a hash function, we take the cross sum of a number and then apply a Caesar cipher to it. This is not a secure hash function, but it illustrates the concept of hashing.'
        },
        'hashing.cross_sum': {
            label: 'Cross sum',
            description: 'Add up the digits of a number',
            dependsOn: ['hashing.caesar_sum']

        },
    }
} as const satisfies Record<
    string,
    Record<
        string,
        {
            label: string;
            dependsOn?: string[];
            uiGates?: UiGate[];
        }
    >
>;

export type SkillTree = typeof skillTree;
export type SkillCategory = keyof SkillTree;
export type SkillId = { [Key in SkillCategory]: keyof SkillTree[Key] }[SkillCategory];

export type SkillNode = {
    label: string;
    description?: string;
    dependsOn?: SkillId[];
    uiGates?: UiGate[];
};

export type FlattenedSkillNode = SkillNode & {
    id: SkillId;
    category: SkillCategory;
};

export const flattenSkillTree = (tree: SkillTree): FlattenedSkillNode[] =>
    (Object.entries(tree) as [SkillCategory, SkillTree[SkillCategory]][]).flatMap(
        ([category, nodes]) =>
            (Object.entries(nodes) as [SkillId, SkillTree[SkillCategory][SkillId]][]).map(
                ([id, node]) => ({
                    id,
                    category,
                    label: node.label,
                    description: node.description,
                    dependsOn: node.dependsOn as SkillId[] | undefined,
                    uiGates: node.uiGates as UiGate[] | undefined
                })
            )
    );