// components/ui/toaster.tsx

"use client";

import { Toaster as HotToast, ToasterProps } from 'react-hot-toast';

// We wrap the Toaster from react-hot-toast to control its defaults and styling
// and make it easy to import across the app.

// You can customize the default props here if needed, 
// for example, overriding the duration or position.
const defaultProps: ToasterProps = {
    position: 'top-center',
    reverseOrder: false,
    toastOptions: {
        // Define default styles for all toasts
        className: 'font-sans',
        style: {
            // Default background/color might be useful if you use default toasts
        },
        // Success, error, and custom styles are handled in NodePage.tsx (for danger)
    }
};

export function Toaster(props: ToasterProps) {
  // Merge any passed props with the defaults
  const mergedProps = { ...defaultProps, ...props };
  
  return <HotToast {...mergedProps} />;
}