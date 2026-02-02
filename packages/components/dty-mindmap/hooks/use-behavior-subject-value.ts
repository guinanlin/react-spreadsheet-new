import { useEffect, useState } from "react";
import type { BehaviorSubject } from "rxjs";

/**
 * 将 BehaviorSubject 的值桥接到 React 状态
 */
export function useBehaviorSubjectValue<T>(subject: BehaviorSubject<T>) {
  const [value, setValue] = useState(() => subject.getValue());

  useEffect(() => {
    const subscription = subject.subscribe(setValue);
    return () => subscription.unsubscribe();
  }, [subject]);

  return value;
}
