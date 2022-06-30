/** 如果代码0.6秒内未响应，返回`"此代码在0.6秒内无响应惹/_ \"`
 * @returns 运行代码后发送的消息
 */
export declare function send(language: string, code: string): String;
/**`send`函数中运行的代码是否异常 */
export declare const isError: Boolean;
/**`send`函数中运行的代码中异常的捕获 */
export declare const e: {
    /**异常类型 */
    name: String;
    /**异常信息 */
    message: String;
}