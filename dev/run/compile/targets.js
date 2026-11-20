module.exports = {
    std: {
        name: "std-v2.dist",
        input: "@/src/Std/Std.entry.js",
        output: "@/dist/www/external/Std",
        isCompilationTool: false,
    },
    compilerv7: {
        name: "compiler-v7.dist",
        input: "@/src/www/modules/CompilerV7/CompilerV7.entry.js",
        output: "@/dist/www/external/CompilerV7",
        isCompilationTool: false,
    },
    devbinaryv7: {
        name: "dev-binary-v7.dist",
        input: "@/src/www/modules/DevBinaryV7/DevBinaryV7.entry.js",
        output: "@/dist/www/external/DevBinaryV7",
        isCompilationTool: false,
    }
};