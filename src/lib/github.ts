/**
 * GitHub API client to fetch public events and calculate recent commits.
 */

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    login: string;
  };
  repo: {
    name: string;
    url: string;
  };
  payload: {
    size?: number;
    distinct_size?: number;
    commits?: Array<{
      sha: string;
      message: string;
    }>;
    action?: string;
  };
  public: boolean;
  created_at: string;
}

/**
 * Fetch public events for a GitHub user and calculate commit/activity count in the last 7 days.
 */
export async function fetchGithubActivityCount(username: string): Promise<number> {
  const url = `https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=100`;
  
  try {
    const response = await fetch(url, {
      headers: {
        // GitHub API requires a User-Agent header
        "User-Agent": "CyberBonsai-README-Widget-Agent",
        "Accept": "application/vnd.github.v3+json",
      },
      // Cache for 15 minutes to avoid hitting rate limits too quickly
      next: { revalidate: 900 } 
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`GitHub user "${username}" not found.`);
      }
      throw new Error(`GitHub API returned status ${response.status}`);
    }

    const events = (await response.json()) as GitHubEvent[];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let activityCount = 0;

    for (const event of events) {
      const eventDate = new Date(event.created_at);
      if (eventDate < sevenDaysAgo) {
        continue; // Only count last 7 days
      }

      if (event.type === "PushEvent" && event.payload.size) {
        // Count distinct commits in this push
        activityCount += event.payload.distinct_size || event.payload.size || 0;
      } else if (
        event.type === "PullRequestEvent" && 
        (event.payload.action === "opened" || event.payload.action === "closed")
      ) {
        activityCount += 2; // Extra reward for PRs
      } else if (event.type === "IssuesEvent" && event.payload.action === "opened") {
        activityCount += 1; // Reward for opening issues
      } else if (event.type === "CreateEvent") {
        activityCount += 1; // Reward for creating repos or branches
      }
    }

    return activityCount;
  } catch (error) {
    console.error("Error fetching GitHub activity:", error);
    // Return 0 or fallback value on error
    return 0;
  }
}
