import { Linter } from 'eslint';
/**
 * Builds ESLint parser options
 *
 * ESLint parser options allows for customizing the behaviour of
 * the ESLint-based parser used to parse JavaScript or TypeScript
 * code. It configures the ECMAScript version, specific syntax or
 * features to consider as valid during parsing, and additional
 * contents in the abstract syntax tree, among other things.
 *
 * @param initialOptions the analysis options to use
 * @param usingBabel a flag to indicate if we intend to parse with Babel
 * @returns the parser options for the input
 */
export declare function buildParserOptions(initialOptions: Linter.ParserOptions, usingBabel?: boolean): Linter.ParserOptions | {
    requireConfigFile: boolean;
    babelOptions: {
        targets: string;
        presets: string[];
        plugins: (string | {
            version: string;
        })[][];
        babelrc: boolean;
        configFile: boolean;
        parserOpts: {
            allowReturnOutsideFunction: boolean;
        };
    };
    ecmaVersion?: 3 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | "latest" | undefined;
    sourceType?: "script" | "module" | undefined;
    ecmaFeatures?: {
        globalReturn?: boolean | undefined;
        impliedStrict?: boolean | undefined;
        jsx?: boolean | undefined;
        experimentalObjectRestSpread?: boolean | undefined;
        [key: string]: any;
    } | undefined;
};
