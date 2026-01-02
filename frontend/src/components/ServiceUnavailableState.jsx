import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

/**
 * Unified Service Unavailable component with standardized design
 * Provides consistent UX across all pages when server is down
 *
 * Variants:
 * - page: Full-page centered state (Dashboard)
 * - inline: Content area banner with note (SearchAccount, forms)
 * - compact: Small placeholder for data sections (Profile)
 *
 * Standard text (required):
 * - Title: "Service temporarily unavailable"
 * - Description: "Cannot connect to server. Please try again later."
 */
export function ServiceUnavailableState({
  variant = "page",
  onRetry,
  loading = false,
  note,
}) {
  const standardTitle = "Service temporarily unavailable";
  const standardDesc = "Cannot connect to server. Please try again later.";

  // Page variant: Full-page centered (Dashboard)
  if (variant === "page") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 max-w-md text-center">
          <AlertCircle className="text-amber-600 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-semibold text-amber-900 mb-2">
            {standardTitle}
          </h2>
          <p className="text-amber-800 mb-6">{standardDesc}</p>

          {note && <p className="text-xs text-amber-700 mb-6 italic">{note}</p>}

          {onRetry && (
            <Button
              onClick={onRetry}
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw size={16} className="mr-2" />
                  Try Again
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Inline variant: Banner in content area (SearchAccount, OpenAccount info)
  if (variant === "inline") {
    return (
      <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
        <AlertCircle
          className="text-amber-600 flex-shrink-0 mt-0.5"
          size={20}
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-900">{standardTitle}</p>
          <p className="text-sm text-amber-800 mt-1">{standardDesc}</p>
          {note && <p className="text-xs text-amber-700 mt-2 italic">{note}</p>}
          {onRetry && (
            <Button
              onClick={onRetry}
              disabled={loading}
              size="sm"
              variant="outline"
              className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw size={14} className="mr-1 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw size={14} className="mr-1" />
                  Retry
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Compact variant: Small placeholder (Profile data sections)
  if (variant === "compact") {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 bg-amber-50 rounded-lg border border-amber-200 text-center">
        <AlertCircle className="text-amber-600 mb-2" size={32} />
        <p className="text-sm font-medium text-amber-900">{standardTitle}</p>
        <p className="text-xs text-amber-800 mt-1">{standardDesc}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            disabled={loading}
            size="sm"
            variant="outline"
            className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="mr-1 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw size={14} className="mr-1" />
                Retry
              </>
            )}
          </Button>
        )}
      </div>
    );
  }

  return null;
}

// Named exports for convenience
export function ServiceUnavailablePageState(props) {
  return <ServiceUnavailableState {...props} variant="page" />;
}

export function ServiceUnavailableFormBanner(props) {
  return <ServiceUnavailableState {...props} variant="inline" />;
}

export function UnavailableDataPlaceholder(props) {
  return <ServiceUnavailableState {...props} variant="compact" />;
}
