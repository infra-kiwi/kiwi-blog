import { parse } from 'yaml';
import { ChatBotSlackChannelProps } from '../constructs/chatbot-slack-channel';
import { readFile } from 'node:fs/promises';

export interface Config {
  notificationChannels: Record<string, ChatBotSlackChannelProps>;
}

export async function loadConfig(configFile: string): Promise<Config> {
  const config: Config = parse(await readFile(configFile, 'utf-8'));

  // Perform some basic validation
  if (config.notificationChannels == null) {
    throw new Error(`Missing notificationChannels object`);
  }
  for (const configKey in config.notificationChannels) {
    const channelConfig = config.notificationChannels[configKey];
    if (!/^T\w+$/.test(channelConfig.slackWorkspaceId ?? '')) {
      throw new Error(
        `Bad slackWorkspaceId for ${configKey}: ${channelConfig.slackWorkspaceId}`
      );
    }
    if (!/^[CG]\w+$/.test(channelConfig.slackChannelId ?? '')) {
      throw new Error(
        `Bad slackChannelId for ${configKey}: ${channelConfig.slackChannelId}`
      );
    }
  }
  return config;
}
