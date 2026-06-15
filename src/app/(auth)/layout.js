/**
 * Auth Layout
 * 
 * This layout wraps /login and /signup routes
 * 
 * Route groups in Next.js:
 * - (auth) is a route group (parentheses don't appear in URL)
 * - /login uses this layout
 * - /signup uses this layout
 * - But /dashboard uses a DIFFERENT layout (dashboard layout)
 * 
 * So you can have different layouts for different sections:
 * - (auth) layout: No navbar, centered form
 * - (dashboard) layout: Sidebar, navbar, etc.
 * 
 * Why?
 * Login/signup pages shouldn't show the landing page navbar
 * Dashboard pages should show a different navbar
 */

export const metadata = {
    title: "SmartSpend AI - Authentication",
    description: "Sign in or create your SmartSpend account",
};

export default function AuthLayout({ children }) {
    return <>{children}</>;
}