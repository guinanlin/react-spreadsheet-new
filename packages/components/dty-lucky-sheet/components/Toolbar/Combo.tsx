import React, {
  CSSProperties,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useContext,
} from "react";
import { createPortal } from "react-dom";
import { locale } from "../../core";
import SVGIcon from "../SVGIcon";
import WorkbookContext from "../../context";

type Props = {
  tooltip: string;
  iconId?: string;
  text?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children: (
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => React.ReactNode;
};

const Combo: React.FC<Props> = ({
  tooltip,
  onClick,
  text,
  iconId,
  children,
}) => {
  const { context } = useContext(WorkbookContext);
  const style: CSSProperties = { userSelect: "none" };
  const [open, setOpen] = useState(false);
  const [portalStyle, setPortalStyle] = useState<CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const { info } = locale(context);

  /** 下拉挂到 body + fixed，避免专业工具栏 overflow 裁剪弹层 */
  useLayoutEffect(() => {
    if (!open) {
      setPortalStyle({});
      return;
    }
    let ro: ResizeObserver | null = null;
    let rafId = 0;
    const updatePosition = () => {
      const btn = buttonRef.current;
      const popup = popupRef.current;
      if (!btn || !popup) return;
      const br = btn.getBoundingClientRect();
      const pw = popup.offsetWidth;
      const ph = popup.offsetHeight;
      let left = br.left;
      let top = br.bottom + 2;
      if (left + pw > window.innerWidth - 8) {
        left = Math.max(8, window.innerWidth - pw - 8);
      }
      if (top + ph > window.innerHeight - 8 && br.top > ph + 8) {
        top = br.top - ph - 2;
      }
      setPortalStyle({
        position: "fixed",
        left,
        top,
        zIndex: 10050,
      });
    };
    let attempts = 0;
    let cancelled = false;
    const afterPortalPaint = () => {
      if (cancelled) return;
      updatePosition();
      const popupEl = popupRef.current;
      if (!popupEl && attempts < 24) {
        attempts += 1;
        rafId = requestAnimationFrame(afterPortalPaint);
        return;
      }
      if (!popupEl) return;
      ro = new ResizeObserver(updatePosition);
      ro.observe(popupEl);
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
    };
    rafId = requestAnimationFrame(afterPortalPaint);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      ro?.disconnect();
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleMouseDown(e: MouseEvent) {
      const t = e.target as Node;
      if (containerRef.current?.contains(t)) return;
      if (popupRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  const popupContent =
    open &&
    typeof document !== "undefined" &&
    createPortal(
      <div
        ref={popupRef}
        className="fortune-toolbar-combo-popup fortune-toolbar-combo-popup--portal"
        style={portalStyle}
      >
        {children?.(setOpen)}
      </div>,
      document.body
    );

  return (
    <div
      ref={containerRef}
      className="fortune-toobar-combo-container fortune-toolbar-item"
    >
      <div ref={buttonRef} className="fortune-toolbar-combo">
        <div
          className="fortune-toolbar-combo-button"
          onClick={(e) => {
            if (onClick) onClick(e);
            else setOpen(!open);
          }}
          tabIndex={0}
          data-tips={tooltip}
          role="button"
          aria-label={`${tooltip}: ${text !== undefined ? text : ""}`}
          style={style}
        >
          {iconId ? (
            <SVGIcon name={iconId} />
          ) : (
            <span className="fortune-toolbar-combo-text">
              {text !== undefined ? text : ""}
            </span>
          )}
        </div>
        <div
          className="fortune-toolbar-combo-arrow"
          onClick={() => setOpen(!open)}
          tabIndex={0}
          data-tips={tooltip}
          role="button"
          aria-label={`${tooltip}: ${info.Dropdown}`}
          style={style}
        >
          <SVGIcon name="combo-arrow" width={10} />
        </div>
        {tooltip && <div className="fortune-tooltip">{tooltip}</div>}
      </div>
      {popupContent}
    </div>
  );
};

export default Combo;
