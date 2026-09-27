import { useEffect, useState } from "react";
import { siteConfig } from "@/config/siteConfig";
import { discordInviteCode } from "@/lib/utils";

export type DiscordCounts = { members: number; online: number; guildName?: string };

/**
 * Lê membros/online do convite oficial pela API pública do Discord.
 * Só roda quando existe um convite real configurado; em caso de falha, retorna null e o site segue normal.
 */
export function useDiscordInvite() {
  const [counts, setCounts] = useState<DiscordCounts | null>(null);

  useEffect(() => {
    const code = discordInviteCode(siteConfig.links.discord);
    if (!code || !siteConfig.discord.showLiveCounts) return;

    const controller = new AbortController();
    fetch(`https://discord.com/api/v10/invites/${code}?with_counts=true`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.approximate_member_count) return;
        setCounts({
          members: data.approximate_member_count,
          online: data.approximate_presence_count ?? 0,
          guildName: data.guild?.name,
        });
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  return counts;
}
