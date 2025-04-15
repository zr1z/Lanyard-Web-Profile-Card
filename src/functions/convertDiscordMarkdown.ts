export function convertDiscordMarkdown(text: string): string {
  let formatted = text;
  formatted = formatted.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
  formatted = formatted.replace(/`([^`]+)`/g, "<code>$1</code>");
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
  formatted = formatted.replace(/__([^_]+)__/g, "<b>$1</b>");
  formatted = formatted.replace(/\*([^*]+)\*/g, "<i>$1</i>");
  formatted = formatted.replace(/_([^_]+)_/g, "<i>$1</i>");
  formatted = formatted.replace(/~~([^~]+)~~/g, "<s>$1</s>");
  formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  const urlPattern = /(\b(https?:\/\/|www\.)[-A-Z0-9+&@#\/%?=~_|!():,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  formatted = formatted.replace(urlPattern, (url) => {
    const link = url.startsWith("www.") ? `http://${url}` : url;
    return `<a href="${link}" target="_blank">${url}</a>`;
  });
  formatted = formatted.replace(/<a?:\w+:(\d+)>/g, (_, emojiId) => {
    return `<img src="https://cdn.discordapp.com/emojis/${emojiId}.webp?size=96" alt="emoji" style="width: 20px; height: 20px; vertical-align: middle; display: inline;" />`;
  });
  return formatted.replace(/\n/g, "<br>");
}
