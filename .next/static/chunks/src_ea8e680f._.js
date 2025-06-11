(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_ea8e680f._.js", {

"[project]/src/hooks/use-toast.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "reducer": (()=>reducer),
    "toast": (()=>toast),
    "useToast": (()=>useToast)
});
// Inspired by react-hot-toast library
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST"
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action)=>{
    switch(action.type){
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case "DISMISS_TOAST":
            {
                const { toastId } = action;
                // ! Side effects ! - This could be extracted into a dismissToast() action,
                // but I'll keep it here for simplicity
                if (toastId) {
                    addToRemoveQueue(toastId);
                } else {
                    state.toasts.forEach((toast)=>{
                        addToRemoveQueue(toast.id);
                    });
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: "UPDATE_TOAST",
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: "DISMISS_TOAST",
            toastId: id
        });
    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(memoryState);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useToast.useEffect": ()=>{
            listeners.push(setState);
            return ({
                "useToast.useEffect": ()=>{
                    const index = listeners.indexOf(setState);
                    if (index > -1) {
                        listeners.splice(index, 1);
                    }
                }
            })["useToast.useEffect"];
        }
    }["useToast.useEffect"], [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: "DISMISS_TOAST",
                toastId
            })
    };
}
_s(useToast, "SPWE98mLGnlsnNfIwu/IAKTSZtk=");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/utils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "cn": (()=>cn)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/toast.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Toast": (()=>Toast),
    "ToastAction": (()=>ToastAction),
    "ToastClose": (()=>ToastClose),
    "ToastDescription": (()=>ToastDescription),
    "ToastProvider": (()=>ToastProvider),
    "ToastTitle": (()=>ToastTitle),
    "ToastViewport": (()=>ToastViewport)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
const ToastProvider = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"];
const ToastViewport = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 16,
        columnNumber: 3
    }, this));
_c1 = ToastViewport;
ToastViewport.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"].displayName;
const toastVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full", {
    variants: {
        variant: {
            default: "border bg-background text-foreground",
            destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
const Toast = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c2 = ({ className, variant, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(toastVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
});
_c3 = Toast;
Toast.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
const ToastAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, this));
_c5 = ToastAction;
ToastAction.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"].displayName;
const ToastClose = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600", className),
        "toast-close": "",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/toast.tsx",
            lineNumber: 86,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 77,
        columnNumber: 3
    }, this));
_c7 = ToastClose;
ToastClose.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"].displayName;
const ToastTitle = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 95,
        columnNumber: 3
    }, this));
_c9 = ToastTitle;
ToastTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const ToastDescription = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm opacity-90", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 107,
        columnNumber: 3
    }, this));
_c11 = ToastDescription;
ToastDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "ToastViewport$React.forwardRef");
__turbopack_context__.k.register(_c1, "ToastViewport");
__turbopack_context__.k.register(_c2, "Toast$React.forwardRef");
__turbopack_context__.k.register(_c3, "Toast");
__turbopack_context__.k.register(_c4, "ToastAction$React.forwardRef");
__turbopack_context__.k.register(_c5, "ToastAction");
__turbopack_context__.k.register(_c6, "ToastClose$React.forwardRef");
__turbopack_context__.k.register(_c7, "ToastClose");
__turbopack_context__.k.register(_c8, "ToastTitle$React.forwardRef");
__turbopack_context__.k.register(_c9, "ToastTitle");
__turbopack_context__.k.register(_c10, "ToastDescription$React.forwardRef");
__turbopack_context__.k.register(_c11, "ToastDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/toaster.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Toaster": (()=>Toaster)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/toast.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function Toaster() {
    _s();
    const { toasts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastProvider"], {
        children: [
            toasts.map(function({ id, title, description, action, ...props }) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toast"], {
                    ...props,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-1",
                            children: [
                                title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastTitle"], {
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/toaster.tsx",
                                    lineNumber: 22,
                                    columnNumber: 25
                                }, this),
                                description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastDescription"], {
                                    children: description
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/toaster.tsx",
                                    lineNumber: 24,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/toaster.tsx",
                            lineNumber: 21,
                            columnNumber: 13
                        }, this),
                        action,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastClose"], {}, void 0, false, {
                            fileName: "[project]/src/components/ui/toaster.tsx",
                            lineNumber: 28,
                            columnNumber: 13
                        }, this)
                    ]
                }, id, true, {
                    fileName: "[project]/src/components/ui/toaster.tsx",
                    lineNumber: 20,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastViewport"], {}, void 0, false, {
                fileName: "[project]/src/components/ui/toaster.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/toaster.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_s(Toaster, "1YTCnXrq2qRowe0H/LBWLjtXoYc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = Toaster;
var _c;
__turbopack_context__.k.register(_c, "Toaster");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/contexts/ThemeContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "ThemeProvider": (()=>ThemeProvider),
    "useTheme": (()=>useTheme)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function ThemeProvider({ children, defaultTheme = "system", storageKey = "videira-theme" }) {
    _s();
    const [theme, setThemeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ThemeProvider.useState": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                try {
                    const storedTheme = localStorage.getItem(storageKey);
                    if (storedTheme && [
                        "light",
                        "dark",
                        "system"
                    ].includes(storedTheme)) {
                        return storedTheme;
                    }
                } catch (e) {
                    // Ignore localStorage errors (e.g., in private browsing)
                    console.error("Failed to read theme from localStorage", e);
                }
            }
            return defaultTheme;
        }
    }["ThemeProvider.useState"]);
    const [resolvedTheme, setResolvedTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ThemeProvider.useState": ()=>{
            // This initial state for resolvedTheme is a best-guess for SSR and initial client render.
            // It will be correctly set by the useEffect hook once the client mounts.
            if (defaultTheme === "dark") return "dark";
            return "light"; // Default to light if system or light, as system preference isn't known SSR.
        }
    }["ThemeProvider.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            // This effect runs on the client after mount.
            const root = window.document.documentElement;
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const applyTheme = {
                "ThemeProvider.useEffect.applyTheme": (currentThemeSetting)=>{
                    let themeToApply;
                    if (currentThemeSetting === "system") {
                        themeToApply = mediaQuery.matches ? "dark" : "light";
                    } else {
                        themeToApply = currentThemeSetting;
                    }
                    root.classList.remove("light", "dark");
                    root.classList.add(themeToApply);
                    setResolvedTheme(themeToApply);
                    try {
                        localStorage.setItem(storageKey, currentThemeSetting);
                    } catch (e) {
                        console.error("Failed to save theme to localStorage", e);
                    }
                }
            }["ThemeProvider.useEffect.applyTheme"];
            applyTheme(theme); // Apply initial theme
            const handleChange = {
                "ThemeProvider.useEffect.handleChange": (e)=>{
                    if (theme === "system") {
                        applyTheme("system");
                    }
                }
            }["ThemeProvider.useEffect.handleChange"];
            mediaQuery.addEventListener("change", handleChange);
            return ({
                "ThemeProvider.useEffect": ()=>mediaQuery.removeEventListener("change", handleChange)
            })["ThemeProvider.useEffect"];
        }
    }["ThemeProvider.useEffect"], [
        theme,
        storageKey
    ]);
    const handleSetTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ThemeProvider.useCallback[handleSetTheme]": (newTheme)=>{
            setThemeState(newTheme);
        }
    }["ThemeProvider.useCallback[handleSetTheme]"], []);
    const contextValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ThemeProvider.useMemo[contextValue]": ()=>({
                theme,
                setTheme: handleSetTheme,
                resolvedTheme
            })
    }["ThemeProvider.useMemo[contextValue]"], [
        theme,
        handleSetTheme,
        resolvedTheme
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: contextValue,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/ThemeContext.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
_s(ThemeProvider, "TxQgC3+C2TFVDn9cjkHCOcLVbAU=");
_c = ThemeProvider;
const useTheme = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
_s1(useTheme, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/types/index.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "cellMeetingStatusOptions": (()=>cellMeetingStatusOptions),
    "encounterTeamRoles": (()=>encounterTeamRoles),
    "getDefaultLessons": (()=>getDefaultLessons),
    "offeringSchema": (()=>offeringSchema),
    "peaceHouseFormSchema": (()=>peaceHouseFormSchema),
    "peaceHouseLessonTitles": (()=>peaceHouseLessonTitles),
    "vidaStatusOptions": (()=>vidaStatusOptions)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/lib/index.mjs [app-client] (ecmascript)");
;
const vidaStatusOptions = [
    {
        value: 'membro',
        label: 'Membro'
    },
    {
        value: 'lider_em_treinamento',
        label: 'Líder em Treinamento'
    },
    {
        value: 'lider_ativo',
        label: 'Líder Ativo'
    }
];
const cellMeetingStatusOptions = [
    {
        value: 'agendada',
        label: 'Agendada'
    },
    {
        value: 'aconteceu',
        label: 'Aconteceu'
    },
    {
        value: 'nao_aconteceu_com_aviso',
        label: 'Não Aconteceu (Com Aviso)'
    },
    {
        value: 'nao_aconteceu_sem_aviso',
        label: 'Não Aconteceu (Sem Aviso)'
    },
    {
        value: 'cancelada_com_aviso',
        label: 'Cancelada (Com Aviso)'
    }
];
const encounterTeamRoles = [
    'Líder da Equipe',
    'Apoio Geral',
    'Apoio Santuário',
    'Cozinha',
    'Intercessor'
];
const offeringSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].object({
    amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].coerce.number().positive({
        message: "Valor deve ser positivo."
    }),
    date: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].date({
        required_error: "Data da oferta é obrigatória."
    }),
    cellGroupName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().optional(),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().optional()
});
const peaceHouseLessonTitles = [
    "Quando Jesus entra em minha casa a verdadeira paz é estabelecida",
    "Quando Jesus entra em minha casa decisões corretas são tomadas",
    "Quando Jesus entra em minha casa o perdão é liberado",
    "Quando Jesus entra em minha casa ressurreições acontecem",
    "Quando Jesus entra em minha casa pessoas são curadas",
    "Quando Jesus entra em minha casa limitações são vencidas",
    "Quando Jesus entra em minha casa pessoas são salvas",
    "Meu coração a principal casa a ser conquistada"
];
function getDefaultLessons() {
    return peaceHouseLessonTitles.map((title, index)=>({
            id: `l${index + 1}`,
            title: title,
            completed: false
        }));
}
const peaceHouseFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].object({
    responsibleCellGroup: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().min(3, {
        message: "Nome do grupo deve ter pelo menos 3 caracteres."
    }),
    scheduledDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].date({
        required_error: "Data de agendamento é obrigatória."
    }),
    location: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().min(5, {
        message: "Local deve ter pelo menos 5 caracteres."
    }),
    hostName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().min(3, {
        message: "Nome do anfitrião deve ter pelo menos 3 caracteres."
    }),
    hostContact: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().min(10, {
        message: "Contato do anfitrião inválido."
    }).regex(/^\s*(\(?\d{2}\)?\s?)?(\d{4,5}-?\d{4})\s*$/, {
        message: "Formato de telefone inválido."
    }),
    designatedTeams: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].string().optional(),
    expectedParticipants: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["z"].coerce.number().int().nonnegative({
        message: "Deve ser um número não negativo."
    }).optional()
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "AuthContext": (()=>AuthContext),
    "AuthProvider": (()=>AuthProvider)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/index.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const initialMockVidas = [
    {
        id: 'vida-lider-joao',
        nomeCompleto: 'Líder João',
        dataNascimento: new Date(1988, 2, 10),
        telefone: '(11) 91234-5678',
        idCelula: 'celula-discipulos-001',
        nomeCelula: 'Discípulos de Cristo',
        geracaoCelula: 'G1',
        status: 'lider_ativo',
        createdAt: new Date()
    },
    {
        id: 'vida-ana',
        nomeCompleto: 'Ana Silva (Membro)',
        dataNascimento: new Date(1990, 5, 15),
        idCelula: 'celula-discipulos-001',
        nomeCelula: 'Discípulos de Cristo',
        geracaoCelula: 'G1',
        status: 'membro',
        createdAt: new Date()
    },
    {
        id: 'vida-bruno',
        nomeCompleto: 'Bruno Costa (Outra Célula)',
        dataNascimento: new Date(1985, 8, 22),
        idCelula: 'celula-leoes-002',
        nomeCelula: 'Leões de Judá',
        geracaoCelula: 'G2',
        status: 'membro',
        createdAt: new Date()
    },
    {
        id: 'vida-carla',
        nomeCompleto: 'Carla Santos (Membro)',
        dataNascimento: new Date(1995, 10, 5),
        idCelula: 'celula-leoes-002',
        nomeCelula: 'Leões de Judá',
        geracaoCelula: 'G2',
        status: 'membro',
        createdAt: new Date()
    },
    {
        id: 'vida-sem-celula',
        nomeCompleto: 'Mariana Dias (Sem Célula)',
        dataNascimento: new Date(1992, 7, 12),
        telefone: '(11) 98888-7777',
        idCelula: '',
        nomeCelula: '',
        geracaoCelula: '',
        status: 'membro',
        createdAt: new Date()
    },
    {
        id: 'vida-pedro',
        nomeCompleto: 'Pedro Álvares (Para Promover)',
        dataNascimento: new Date(1993, 4, 20),
        telefone: '(21) 99999-8888',
        idCelula: 'celula-leoes-002',
        nomeCelula: 'Leões de Judá',
        geracaoCelula: 'G2',
        status: 'membro',
        createdAt: new Date()
    },
    {
        id: 'vida-lucia',
        nomeCompleto: 'Lúcia Ferreira (Treinamento)',
        dataNascimento: new Date(1980, 1, 1),
        telefone: '(31) 91111-2222',
        idCelula: 'celula-nova-geracao-003',
        nomeCelula: 'Nova Geração',
        geracaoCelula: 'G3',
        status: 'lider_em_treinamento',
        createdAt: new Date()
    }
];
const initialMockCellGroups = [
    {
        id: 'celula-discipulos-001',
        name: 'Discípulos de Cristo',
        address: 'Rua da Fé, 123',
        meetingDay: 'Quarta-feira',
        meetingTime: '19:30',
        geracao: 'G1',
        liderVidaId: 'vida-lider-joao',
        liderNome: 'Líder João',
        meetingStatus: 'aconteceu',
        lastStatusUpdate: new Date(new Date().setDate(new Date().getDate() - 2))
    },
    {
        id: 'celula-leoes-002',
        name: 'Leões de Judá',
        address: 'Av. Esperança, 456',
        meetingDay: 'Quinta-feira',
        meetingTime: '20:00',
        geracao: 'G2',
        meetingStatus: 'agendada',
        lastStatusUpdate: new Date(new Date().setDate(new Date().getDate() - 7))
    },
    {
        id: 'celula-nova-geracao-003',
        name: 'Nova Geração',
        address: 'Praça da Alegria, 789',
        meetingDay: 'Terça-feira',
        meetingTime: '18:00',
        geracao: 'G3',
        liderVidaId: 'vida-lucia',
        liderNome: 'Lúcia Ferreira',
        meetingStatus: 'agendada',
        lastStatusUpdate: new Date(new Date().setDate(new Date().getDate() - 1))
    }
];
const mockMissionarioUser = {
    id: 'user-missionario-01',
    name: 'Admin Missionário',
    email: 'matheus.santos01@gmail.com',
    role: 'missionario',
    isActive: true
};
const mockLiderUserInitial = {
    id: 'user-lider-joao-01',
    name: 'Líder João',
    email: 'lider.joao@videira.app',
    role: 'lider_de_celula',
    vidaId: 'vida-lider-joao',
    cellGroupId: 'celula-discipulos-001',
    cellGroupName: 'Discípulos de Cristo',
    isActive: true
};
const mockLiderLuciaUser = {
    id: 'user-lider-lucia-02',
    name: 'Lúcia Ferreira',
    email: 'lucia.ferreira@videira.app',
    role: 'lider_de_celula',
    vidaId: 'vida-lucia',
    cellGroupId: 'celula-nova-geracao-003',
    cellGroupName: 'Nova Geração',
    isActive: true
};
const initialMockUsers = [
    mockMissionarioUser,
    mockLiderUserInitial,
    mockLiderLuciaUser
];
const currentYear = new Date().getFullYear();
const initialMockOfferings = [
    {
        id: "off1",
        amount: 50,
        date: new Date(2024, 5, 5),
        cellGroupName: "Discípulos de Cristo",
        notes: "Oferta semanal"
    },
    {
        id: "off2",
        amount: 75,
        date: new Date(2024, 5, 12),
        cellGroupName: "Leões de Judá",
        notes: "Culto de domingo"
    },
    {
        id: "off3",
        amount: 60,
        date: new Date(2024, 6, 3),
        cellGroupName: "Discípulos de Cristo"
    },
    {
        id: "off4",
        amount: 100,
        date: new Date(2024, 6, 10),
        cellGroupName: "Leões de Judá",
        notes: "Oferta especial"
    },
    {
        id: "off5",
        amount: 40,
        date: new Date(2024, 6, 17),
        cellGroupName: "Discípulos de Cristo",
        notes: "Para missões"
    },
    {
        id: "off6",
        amount: 80,
        date: new Date(currentYear, new Date().getMonth(), 1),
        cellGroupName: "Nova Geração",
        notes: "Oferta deste mês"
    },
    {
        id: "off7",
        amount: 120,
        date: new Date(currentYear, new Date().getMonth() - 1, 15),
        cellGroupName: "Discípulos de Cristo",
        notes: "Oferta do mês passado"
    }
];
const initialMockPeaceHouses = [];
const defaultGeracaoVideiraDescription = `A Geração Videira Verdadeira representa o compromisso com a formação de discípulos
segundo os ensinamentos de Cristo, cultivando líderes e membros que frutificam
em amor, serviço e fé. Sob a liderança e visão missionária, buscamos expandir
o Reino de Deus, célula por célula, vida por vida.`;
function AuthProvider({ children }) {
    _s();
    const [user, setUserState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [vidasData, setVidasData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialMockVidas);
    const [cellGroupsData, setCellGroupsData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialMockCellGroups);
    const [usersData, setUsersData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialMockUsers);
    const [offeringsData, setOfferingsData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialMockOfferings);
    const [peaceHousesData, setPeaceHousesData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialMockPeaceHouses);
    const [appPermissions, setAppPermissions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        liderPodeVerRelatorios: false
    });
    const [geracaoVideiraConfig, setGeracaoVideiraConfigState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        description: defaultGeracaoVideiraDescription
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const storedUser = localStorage.getItem('authUser');
                if (storedUser) {
                    try {
                        setUserState(JSON.parse(storedUser));
                    } catch (error) {
                        console.error("Failed to parse authUser from localStorage", error);
                        localStorage.removeItem('authUser');
                    }
                }
                const storedPermissions = localStorage.getItem('appPermissions');
                if (storedPermissions) {
                    try {
                        setAppPermissions(JSON.parse(storedPermissions));
                    } catch (error) {
                        console.error("Failed to parse appPermissions from localStorage", error);
                    }
                }
                const storedGeracaoConfig = localStorage.getItem('geracaoVideiraConfig');
                if (storedGeracaoConfig) {
                    try {
                        setGeracaoVideiraConfigState(JSON.parse(storedGeracaoConfig));
                    } catch (error) {
                        console.error("Failed to parse geracaoVideiraConfig from localStorage", error);
                        setGeracaoVideiraConfigState({
                            description: defaultGeracaoVideiraDescription
                        });
                    }
                }
            }
        }
    }["AuthProvider.useEffect"], []);
    const setUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[setUser]": (newUser)=>{
            setUserState(newUser);
            if ("TURBOPACK compile-time truthy", 1) {
                if (newUser) {
                    localStorage.setItem('authUser', JSON.stringify(newUser));
                } else {
                    localStorage.removeItem('authUser');
                }
            }
        }
    }["AuthProvider.useCallback[setUser]"], []);
    const setGeracaoVideiraDescription = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[setGeracaoVideiraDescription]": (description)=>{
            const newConfig = {
                description
            };
            setGeracaoVideiraConfigState(newConfig);
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem('geracaoVideiraConfig', JSON.stringify(newConfig));
            }
        }
    }["AuthProvider.useCallback[setGeracaoVideiraDescription]"], []);
    const loginWithEmail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[loginWithEmail]": async (email, password)=>{
            const foundUser = usersData.find({
                "AuthProvider.useCallback[loginWithEmail].foundUser": (u)=>u.email.toLowerCase() === email.toLowerCase()
            }["AuthProvider.useCallback[loginWithEmail].foundUser"]);
            if (foundUser) {
                if (foundUser.email === 'matheus.santos01@gmail.com' && password !== 'videira1701') {
                    console.warn("Senha incorreta para o missionário.");
                    return false;
                }
                if (!foundUser.isActive) {
                    console.warn(`Usuário ${foundUser.name} está inativo.`);
                    return false;
                }
                setUser(foundUser);
                return true;
            }
            console.warn("Usuário não encontrado:", email);
            return false;
        }
    }["AuthProvider.useCallback[loginWithEmail]"], [
        usersData,
        setUser
    ]);
    const simulateLoginByRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[simulateLoginByRole]": (role)=>{
            let userToLogin;
            if (role === 'missionario') {
                userToLogin = usersData.find({
                    "AuthProvider.useCallback[simulateLoginByRole]": (u)=>u.email === 'matheus.santos01@gmail.com'
                }["AuthProvider.useCallback[simulateLoginByRole]"]);
            } else {
                userToLogin = usersData.find({
                    "AuthProvider.useCallback[simulateLoginByRole]": (u)=>u.role === 'lider_de_celula' && u.vidaId === 'vida-lider-joao' && u.isActive
                }["AuthProvider.useCallback[simulateLoginByRole]"]);
                if (!userToLogin) {
                    userToLogin = usersData.find({
                        "AuthProvider.useCallback[simulateLoginByRole]": (u)=>u.role === 'lider_de_celula' && u.isActive
                    }["AuthProvider.useCallback[simulateLoginByRole]"]);
                }
            }
            if (userToLogin && userToLogin.isActive) {
                setUser(userToLogin);
            } else if (userToLogin && !userToLogin.isActive) {
                console.warn(`Usuário ${userToLogin.name} (${role}) está inativo. Login não realizado.`);
                setUser(null);
            } else {
                console.warn(`Nenhum usuário ativo encontrado para o papel: ${role}`);
                setUser(null);
            }
        }
    }["AuthProvider.useCallback[simulateLoginByRole]"], [
        usersData,
        setUser
    ]);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": ()=>{
            setUser(null);
        }
    }["AuthProvider.useCallback[logout]"], [
        setUser
    ]);
    const updateMockVida = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[updateMockVida]": (updatedVida)=>{
            setVidasData({
                "AuthProvider.useCallback[updateMockVida]": (prev)=>prev.map({
                        "AuthProvider.useCallback[updateMockVida]": (v)=>v.id === updatedVida.id ? updatedVida : v
                    }["AuthProvider.useCallback[updateMockVida]"])
            }["AuthProvider.useCallback[updateMockVida]"]);
            if (updatedVida.status === 'lider_ativo' || updatedVida.status === 'lider_em_treinamento') {
                if (updatedVida.idCelula) {
                    setCellGroupsData({
                        "AuthProvider.useCallback[updateMockVida]": (prevCGs)=>prevCGs.map({
                                "AuthProvider.useCallback[updateMockVida]": (cg)=>{
                                    if (cg.id === updatedVida.idCelula) {
                                        return {
                                            ...cg,
                                            liderVidaId: updatedVida.id,
                                            liderNome: updatedVida.nomeCompleto
                                        };
                                    }
                                    if (cg.liderVidaId === updatedVida.id && cg.id !== updatedVida.idCelula) {
                                        return {
                                            ...cg,
                                            liderVidaId: undefined,
                                            liderNome: undefined
                                        };
                                    }
                                    return cg;
                                }
                            }["AuthProvider.useCallback[updateMockVida]"])
                    }["AuthProvider.useCallback[updateMockVida]"]);
                }
                setUsersData({
                    "AuthProvider.useCallback[updateMockVida]": (prevUsers)=>prevUsers.map({
                            "AuthProvider.useCallback[updateMockVida]": (u)=>{
                                if (u.vidaId === updatedVida.id) {
                                    const updatedAuthUser = {
                                        ...u,
                                        role: 'lider_de_celula',
                                        cellGroupId: updatedVida.idCelula || undefined,
                                        cellGroupName: updatedVida.nomeCelula || undefined,
                                        name: updatedVida.nomeCompleto
                                    };
                                    if (user && user.id === u.id) {
                                        setUser(updatedAuthUser);
                                    }
                                    return updatedAuthUser;
                                }
                                return u;
                            }
                        }["AuthProvider.useCallback[updateMockVida]"])
                }["AuthProvider.useCallback[updateMockVida]"]);
            } else if (updatedVida.status === 'membro') {
                setCellGroupsData({
                    "AuthProvider.useCallback[updateMockVida]": (prevCGs)=>prevCGs.map({
                            "AuthProvider.useCallback[updateMockVida]": (cg)=>{
                                if (cg.liderVidaId === updatedVida.id) {
                                    return {
                                        ...cg,
                                        liderVidaId: undefined,
                                        liderNome: undefined
                                    };
                                }
                                return cg;
                            }
                        }["AuthProvider.useCallback[updateMockVida]"])
                }["AuthProvider.useCallback[updateMockVida]"]);
                setUsersData({
                    "AuthProvider.useCallback[updateMockVida]": (prevUsers)=>prevUsers.map({
                            "AuthProvider.useCallback[updateMockVida]": (u)=>{
                                if (u.vidaId === updatedVida.id && u.role === 'lider_de_celula') {
                                    const updatedAuthUser = {
                                        ...u,
                                        cellGroupId: undefined,
                                        cellGroupName: undefined
                                    };
                                    if (user && user.id === u.id) {
                                        setUser({
                                            "AuthProvider.useCallback[updateMockVida]": (prevU)=>prevU ? {
                                                    ...prevU,
                                                    cellGroupId: undefined,
                                                    cellGroupName: undefined
                                                } : null
                                        }["AuthProvider.useCallback[updateMockVida]"]);
                                    }
                                    return updatedAuthUser;
                                }
                                return u;
                            }
                        }["AuthProvider.useCallback[updateMockVida]"])
                }["AuthProvider.useCallback[updateMockVida]"]);
            }
        }
    }["AuthProvider.useCallback[updateMockVida]"], [
        user,
        setUser
    ]);
    const addMockVida = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[addMockVida]": (newVida)=>{
            setVidasData({
                "AuthProvider.useCallback[addMockVida]": (prev)=>[
                        {
                            ...newVida,
                            createdAt: newVida.createdAt || new Date()
                        },
                        ...prev
                    ]
            }["AuthProvider.useCallback[addMockVida]"]);
        }
    }["AuthProvider.useCallback[addMockVida]"], []);
    const updateMockCellGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[updateMockCellGroup]": (updatedCG, oldLiderVidaId)=>{
            setCellGroupsData({
                "AuthProvider.useCallback[updateMockCellGroup]": (prevCGs)=>prevCGs.map({
                        "AuthProvider.useCallback[updateMockCellGroup]": (cg)=>cg.id === updatedCG.id ? updatedCG : cg
                    }["AuthProvider.useCallback[updateMockCellGroup]"])
            }["AuthProvider.useCallback[updateMockCellGroup]"]);
            if (updatedCG.liderVidaId) {
                setVidasData({
                    "AuthProvider.useCallback[updateMockCellGroup]": (prevVidas)=>prevVidas.map({
                            "AuthProvider.useCallback[updateMockCellGroup]": (v)=>{
                                if (v.id === updatedCG.liderVidaId) {
                                    return {
                                        ...v,
                                        idCelula: updatedCG.id,
                                        nomeCelula: updatedCG.name,
                                        geracaoCelula: updatedCG.geracao,
                                        status: v.status !== 'lider_ativo' && v.status !== 'lider_em_treinamento' ? 'lider_ativo' : v.status
                                    };
                                }
                                return v;
                            }
                        }["AuthProvider.useCallback[updateMockCellGroup]"])
                }["AuthProvider.useCallback[updateMockCellGroup]"]);
                setUsersData({
                    "AuthProvider.useCallback[updateMockCellGroup]": (prevUsers)=>{
                        const existingUserIndex = prevUsers.findIndex({
                            "AuthProvider.useCallback[updateMockCellGroup].existingUserIndex": (u)=>u.vidaId === updatedCG.liderVidaId
                        }["AuthProvider.useCallback[updateMockCellGroup].existingUserIndex"]);
                        if (existingUserIndex !== -1) {
                            const updatedUsers = [
                                ...prevUsers
                            ];
                            const updatedAuthUser = {
                                ...updatedUsers[existingUserIndex],
                                role: 'lider_de_celula',
                                cellGroupId: updatedCG.id,
                                cellGroupName: updatedCG.name,
                                name: updatedCG.liderNome || updatedUsers[existingUserIndex].name,
                                isActive: updatedUsers[existingUserIndex].isActive === undefined ? true : updatedUsers[existingUserIndex].isActive
                            };
                            updatedUsers[existingUserIndex] = updatedAuthUser;
                            if (user && user.id === updatedAuthUser.id) {
                                setUser(updatedAuthUser);
                            }
                            return updatedUsers;
                        } else {
                            const newLiderUser = {
                                id: `user-${updatedCG.liderVidaId}-${Date.now()}`,
                                name: updatedCG.liderNome || 'Nome do Líder',
                                email: `${(updatedCG.liderNome || 'lider').toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '')}@videira.app`,
                                role: 'lider_de_celula',
                                vidaId: updatedCG.liderVidaId,
                                cellGroupId: updatedCG.id,
                                cellGroupName: updatedCG.name,
                                isActive: true
                            };
                            if (user && user.vidaId === newLiderUser.vidaId) {
                                setUser(newLiderUser);
                            }
                            return [
                                ...prevUsers,
                                newLiderUser
                            ];
                        }
                    }
                }["AuthProvider.useCallback[updateMockCellGroup]"]);
            }
            if (oldLiderVidaId && oldLiderVidaId !== updatedCG.liderVidaId) {
                setVidasData({
                    "AuthProvider.useCallback[updateMockCellGroup]": (prevVidas)=>prevVidas.map({
                            "AuthProvider.useCallback[updateMockCellGroup]": (v)=>{
                                if (v.id === oldLiderVidaId && v.idCelula === updatedCG.id) {
                                    return {
                                        ...v,
                                        idCelula: '',
                                        nomeCelula: '',
                                        geracaoCelula: ''
                                    };
                                }
                                return v;
                            }
                        }["AuthProvider.useCallback[updateMockCellGroup]"])
                }["AuthProvider.useCallback[updateMockCellGroup]"]);
                setUsersData({
                    "AuthProvider.useCallback[updateMockCellGroup]": (prevUsers)=>prevUsers.map({
                            "AuthProvider.useCallback[updateMockCellGroup]": (u)=>{
                                if (u.vidaId === oldLiderVidaId && u.cellGroupId === updatedCG.id) {
                                    const updatedAuthUser = {
                                        ...u,
                                        cellGroupId: undefined,
                                        cellGroupName: undefined
                                    };
                                    if (user && user.id === u.id) {
                                        setUser(updatedAuthUser);
                                    }
                                    return updatedAuthUser;
                                }
                                return u;
                            }
                        }["AuthProvider.useCallback[updateMockCellGroup]"])
                }["AuthProvider.useCallback[updateMockCellGroup]"]);
            }
        }
    }["AuthProvider.useCallback[updateMockCellGroup]"], [
        user,
        setUser
    ]);
    const addMockCellGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[addMockCellGroup]": (newCG)=>{
            const cellWithDefaults = {
                ...newCG,
                lastStatusUpdate: newCG.lastStatusUpdate || new Date()
            };
            setCellGroupsData({
                "AuthProvider.useCallback[addMockCellGroup]": (prev)=>[
                        cellWithDefaults,
                        ...prev
                    ]
            }["AuthProvider.useCallback[addMockCellGroup]"]);
            if (newCG.liderVidaId) {
                updateMockCellGroup(cellWithDefaults);
            }
        }
    }["AuthProvider.useCallback[addMockCellGroup]"], [
        updateMockCellGroup
    ]);
    const addMockUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[addMockUser]": (newUser)=>{
            setUsersData({
                "AuthProvider.useCallback[addMockUser]": (prev)=>{
                    const existingUserIndex = prev.findIndex({
                        "AuthProvider.useCallback[addMockUser].existingUserIndex": (u)=>u.vidaId && newUser.vidaId && u.vidaId === newUser.vidaId
                    }["AuthProvider.useCallback[addMockUser].existingUserIndex"]);
                    if (existingUserIndex !== -1) {
                        const updatedUsers = [
                            ...prev
                        ];
                        updatedUsers[existingUserIndex] = {
                            ...updatedUsers[existingUserIndex],
                            ...newUser,
                            isActive: newUser.isActive ?? updatedUsers[existingUserIndex].isActive ?? true
                        };
                        if (user && user.id === updatedUsers[existingUserIndex].id) {
                            setUser(updatedUsers[existingUserIndex]);
                        }
                        return updatedUsers;
                    }
                    return [
                        {
                            ...newUser,
                            isActive: newUser.isActive ?? true
                        },
                        ...prev
                    ];
                }
            }["AuthProvider.useCallback[addMockUser]"]);
        }
    }["AuthProvider.useCallback[addMockUser]"], [
        user,
        setUser
    ]);
    const updateMockUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[updateMockUser]": (updatedUser)=>{
            setUsersData({
                "AuthProvider.useCallback[updateMockUser]": (prev)=>prev.map({
                        "AuthProvider.useCallback[updateMockUser]": (u)=>{
                            if (u.id === updatedUser.id) {
                                const mergedUser = {
                                    ...u,
                                    ...updatedUser,
                                    isActive: updatedUser.isActive ?? u.isActive ?? true
                                };
                                if (user && user.id === updatedUser.id) {
                                    setUser(mergedUser);
                                }
                                return mergedUser;
                            }
                            return u;
                        }
                    }["AuthProvider.useCallback[updateMockUser]"])
            }["AuthProvider.useCallback[updateMockUser]"]);
        }
    }["AuthProvider.useCallback[updateMockUser]"], [
        user,
        setUser
    ]);
    const addMockOffering = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[addMockOffering]": (newOfferingData)=>{
            const newOffering = {
                id: `off-${Date.now()}`,
                ...newOfferingData
            };
            setOfferingsData({
                "AuthProvider.useCallback[addMockOffering]": (prev)=>[
                        newOffering,
                        ...prev
                    ]
            }["AuthProvider.useCallback[addMockOffering]"]);
        }
    }["AuthProvider.useCallback[addMockOffering]"], []);
    const toggleUserActiveStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[toggleUserActiveStatus]": (userIdToToggle)=>{
            setUsersData({
                "AuthProvider.useCallback[toggleUserActiveStatus]": (prevUsers)=>prevUsers.map({
                        "AuthProvider.useCallback[toggleUserActiveStatus]": (u)=>{
                            if (u.id === userIdToToggle) {
                                const newActiveStatus = u.isActive === undefined ? false : !u.isActive;
                                const updatedUserRecord = {
                                    ...u,
                                    isActive: newActiveStatus
                                };
                                if (user && user.id === userIdToToggle) {
                                    setUser(updatedUserRecord);
                                }
                                return updatedUserRecord;
                            }
                            return u;
                        }
                    }["AuthProvider.useCallback[toggleUserActiveStatus]"])
            }["AuthProvider.useCallback[toggleUserActiveStatus]"]);
        }
    }["AuthProvider.useCallback[toggleUserActiveStatus]"], [
        user,
        setUser
    ]);
    const toggleLiderPodeVerRelatorios = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[toggleLiderPodeVerRelatorios]": ()=>{
            setAppPermissions({
                "AuthProvider.useCallback[toggleLiderPodeVerRelatorios]": (prev)=>{
                    const newPermissions = {
                        ...prev,
                        liderPodeVerRelatorios: !prev.liderPodeVerRelatorios
                    };
                    if ("TURBOPACK compile-time truthy", 1) {
                        localStorage.setItem('appPermissions', JSON.stringify(newPermissions));
                    }
                    return newPermissions;
                }
            }["AuthProvider.useCallback[toggleLiderPodeVerRelatorios]"]);
        }
    }["AuthProvider.useCallback[toggleLiderPodeVerRelatorios]"], []);
    const addMockPeaceHouse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[addMockPeaceHouse]": (newPeaceHouseData)=>{
            const newPeaceHouse = {
                id: `ph-${Date.now()}`,
                ...newPeaceHouseData,
                createdAt: new Date(),
                lessonsProgress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDefaultLessons"])(),
                isCompleted: false
            };
            setPeaceHousesData({
                "AuthProvider.useCallback[addMockPeaceHouse]": (prev)=>[
                        newPeaceHouse,
                        ...prev
                    ]
            }["AuthProvider.useCallback[addMockPeaceHouse]"]);
        }
    }["AuthProvider.useCallback[addMockPeaceHouse]"], []);
    const updateMockPeaceHouse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[updateMockPeaceHouse]": (updatedPeaceHouse)=>{
            setPeaceHousesData({
                "AuthProvider.useCallback[updateMockPeaceHouse]": (prev)=>prev.map({
                        "AuthProvider.useCallback[updateMockPeaceHouse]": (ph)=>ph.id === updatedPeaceHouse.id ? updatedPeaceHouse : ph
                    }["AuthProvider.useCallback[updateMockPeaceHouse]"])
            }["AuthProvider.useCallback[updateMockPeaceHouse]"]);
        }
    }["AuthProvider.useCallback[updateMockPeaceHouse]"], []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[value]": ()=>({
                user,
                setUser,
                loginWithEmail,
                logout,
                simulateLoginByRole,
                mockUsers: usersData,
                mockVidas: vidasData,
                mockCellGroups: cellGroupsData,
                mockOfferings: offeringsData,
                mockPeaceHouses: peaceHousesData,
                updateMockVida,
                addMockVida,
                updateMockCellGroup,
                addMockCellGroup,
                addMockUser,
                updateMockUser,
                addMockOffering,
                addMockPeaceHouse,
                updateMockPeaceHouse,
                toggleUserActiveStatus,
                appPermissions,
                toggleLiderPodeVerRelatorios,
                geracaoVideiraConfig,
                setGeracaoVideiraDescription
            })
    }["AuthProvider.useMemo[value]"], [
        user,
        setUser,
        loginWithEmail,
        logout,
        simulateLoginByRole,
        usersData,
        vidasData,
        cellGroupsData,
        offeringsData,
        peaceHousesData,
        updateMockVida,
        addMockVida,
        updateMockCellGroup,
        addMockCellGroup,
        addMockUser,
        updateMockUser,
        addMockOffering,
        addMockPeaceHouse,
        updateMockPeaceHouse,
        toggleUserActiveStatus,
        appPermissions,
        toggleLiderPodeVerRelatorios,
        geracaoVideiraConfig,
        setGeracaoVideiraDescription
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/AuthContext.tsx",
        lineNumber: 464,
        columnNumber: 10
    }, this);
}
_s(AuthProvider, "z3sLIm7IbQfRpNDm5uDmHfZiDMA=");
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_ea8e680f._.js.map