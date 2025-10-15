// 为不同的相对路径导入提供类型声明
declare module '../core/modules/ssf' {
  const SSF: {
    format: (fmt: string, value: any) => string;
    is_date: (fmt: string, value?: any) => boolean;
  };
  export default SSF;
}

declare module './ssf' {
  const SSF: {
    format: (fmt: string, value: any) => string;
    is_date: (fmt: string, value?: any) => boolean;
  };
  export default SSF;
}

declare module '../modules/ssf' {
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
