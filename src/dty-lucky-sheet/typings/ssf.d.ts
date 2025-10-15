declare module '../core/modules/ssf' {
  const SSF: {
    format: (fmt: string, value: any) => string;
    is_date: (fmt: string, value?: any) => boolean;
  };
  export default SSF;
}

// 全局声明，用于直接导入 SSF
declare const SSF: {
  format: (fmt: string, value: any) => string;
  is_date: (fmt: string, value?: any) => boolean;
};
