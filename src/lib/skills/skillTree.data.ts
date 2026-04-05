export type UiGate = `gate:${string}`;

export const skillTree = {
    encoding: {
        'encoding.roman': {
            label: 'Roman alphabet',
            description: 'Our journey starts with the 23 letters of the Roman alphabet'
        },
        'encoding.latin': {
            label: 'Latin alphabet',
            description: 'Let\'s continue with the 26 letters of the Latin alphabet in Engleish',
            dependsOn: ['encoding.roman']
        },
        'encoding.decimal': {
            label: 'Decimal numbers',
            dependsOn: ['encoding.roman']
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
    basic: {
        'basic.intro': {
            label: 'Basic knowledge',
            description: 'Learn the distinctions.'
        },
        'basic.caesar': {
            label: 'Caesar Cipher',
            description: 'Learn about the simple substitution cipher.'
        }
    },
    symmetric: {
        'sym.encrypt.ceasar': {
            label: 'Encrypt'
        },
        'sym.decrypt.ceasar': {
            label: 'Decrypt',
            dependsOn: ['sym.encrypt.ceasar'],
        },
        'sym.block_size': {
            label: 'Block size',
            dependsOn: ['sym.decrypt.ceasar']
        },
        'sym.otp': {
            label: 'One-time pad',
            dependsOn: ['sym.block_size']
        },
        'sym.aes.encrypt': {
            label: 'Encrypt with AES',
            dependsOn: ['sym.decrypt.ceasar', 'encoding.bytes']
        },
        'sym.aes.decrypt': {
            label: 'Decrypt with AES',
            dependsOn: ['sym.aes.encrypt']
        }
    },
    asymmetric: {
        'asym.encrypt.ceasar': {
            label: 'Encrypt'
        },
        'asym.decrypt.ceasar': {
            label: 'Decrypt',
            dependsOn: ['asym.encrypt.ceasar'],
        },
        'asym.encrypt.num': {
            label: 'Encrypt numbers using RSA',
            dependsOn: ['asym.decrypt.ceasar'],
        },
        'asym.quantum': {
            label: 'Quantum attacks',
            description: 'Learn about how quantum computers can break RSA and other asymmetric encryption schemes.',
            dependsOn: ['asym.decrypt.ceasar'],
        },
    },
    hashing: {
        'hashing.overview': {
            label: 'Hashing Overview',
            description: 'Learn why hashing is one-way and cannot be decrypted, and how it differs from encryption.'
        },
        'hashing.cross_sum': {
            label: 'Cross sum',
            description: 'In this simple example of a hash function, we take the cross sum of a number and then apply a Caesar cipher to it. This is not a secure hash function, but it illustrates the concept of hashing.'
        },
        'hashing.mod10': {
            label: 'Modulo 10',
            description: 'Common checksum algorithm used in credit card numbers and other identifiers. It sums the digits of a number and then takes the result modulo 10.',
            dependsOn: ['hashing.cross_sum', 'encoding.decimal']
        },
        'hashing.md5': {
            label: 'MD5',
            description: 'An early used cryptographic hash function.',
            dependsOn: ['hashing.mod10', 'encoding.bytes']
        },
        'hashing.sha256': {
            label: 'SHA-256',
            description: 'A widely used cryptographic hash function.',
            dependsOn: ['hashing.md5', 'encoding.bytes']
        },
        'hashing.attack': {
            label: 'Hashing Attacks',
            description: 'Learn about common attacks on hash functions.',
            dependsOn: ['hashing.mod10']
        },
        'hashing.password': {
            label: 'Password Hashing',
            description: 'Learn about secure password hashing techniques.',
            dependsOn: ['hashing.attack']
        },
        'hashing.salted': {
            label: 'Salting Hashes',
            description: 'Learn about adding salt to hashes for improved security.',
            dependsOn: ['hashing.attack']
        },
        'hashing.slow': {
            label: 'Slow Hashing',
            description: 'Learn about using slow hashing functions for password security.',
            dependsOn: ['hashing.salted']
        }
    }
} as const satisfies Record<
    string,
    Record<
        string,
        {
            label: string;
            description?: string;
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