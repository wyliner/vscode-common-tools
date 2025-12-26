import * as vscode from 'vscode';

/**
 * 命令操作模式枚举
 */
export enum CommandOperationMode {
    /** 生成模式：生成新内容不需要输入，例如UUID、当前时间戳等 */
    GENERATE = 'generate',
    
    /** 转换模式：需要选中并转换，例如格式化JSON、转换时间格式等 */
    TRANSFORM = 'transform',
    
    /** 混合模式：既可以生成也可以转换，根据是否有输入决定 */
    HYBRID = 'hybrid'
}

/**
 * 命令插入策略枚举
 */
export enum InsertStrategy {
    /** 替换选中内容或整个文档 */
    REPLACE = 'replace',
    
    /** 插入到光标位置或文档末尾 */
    INSERT = 'insert',
    
    /** 智能模式：有选中内容则替换，否则插入 */
    SMART = 'smart'
}

/**
 * 通用命令定义接口
 * 用于统一管理插件中的各类命令
 */
export interface CommonCommand {
    /** 命令ID */
    command: string;
    
    /** 命令标题 */
    title: string;
    
    /** 执行成功后显示的消息 */
    message: string;
    
    /** 命令处理函数 - 支持同步或异步返回字符串 */
    fn: (text?: string) => string | Promise<string>;
    
    /**
     * 操作模式
     * - GENERATE: 生成新内容，不需要输入（如UUID、当前时间戳）
     * - TRANSFORM: 转换现有内容，需要输入（如格式化JSON）
     * - HYBRID: 混合模式，有输入则转换，无输入则生成（如时间格式化）
     */
    operationMode?: CommandOperationMode;
    
    /**
     * 插入策略
     * - REPLACE: 替换选中内容或整个文档
     * - INSERT: 插入到光标位置或文档末尾
     * - SMART: 有选中内容则替换，否则插入
     */
    insertStrategy?: InsertStrategy;
}
