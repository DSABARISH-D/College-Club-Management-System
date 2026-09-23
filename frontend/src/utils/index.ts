/**
 * Format a date string into a human-readable format.
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date string with time.
 */
export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get a relative time string (e.g., "2 hours ago", "3 days ago").
 */
export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) return formatDate(dateStr);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

/**
 * Get the status badge color class for an activity status.
 */
export function getStatusBadge(status: string): string {
  switch (status) {
    case 'UPCOMING': return 'badge-primary';
    case 'ONGOING': return 'badge-green';
    case 'COMPLETED': return 'badge-gray';
    case 'CANCELLED': return 'badge-red';
    default: return 'badge-gray';
  }
}

/**
 * Get the priority badge color class for an announcement priority.
 */
export function getPriorityBadge(priority: string): string {
  switch (priority) {
    case 'HIGH': return 'badge-red';
    case 'NORMAL': return 'badge-primary';
    case 'LOW': return 'badge-gray';
    default: return 'badge-gray';
  }
}

/**
 * Get the approval badge color class.
 */
export function getApprovalBadge(status: string): string {
  switch (status) {
    case 'APPROVED': return 'badge-green';
    case 'PENDING': return 'badge-amber';
    case 'REJECTED': return 'badge-red';
    default: return 'badge-gray';
  }
}

/**
 * Get an error message string from an Axios error.
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const err = error as { response?: { data?: { detail?: string } }; message?: string };
    if (err.response?.data?.detail) return err.response.data.detail;
    if (err.message) return err.message;
  }
  return 'An unexpected error occurred';
}
