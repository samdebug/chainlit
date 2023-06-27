import { ILLMSettings } from 'state/chat';
import { Role } from 'state/user';

// export const serverUrl = new URL('http://127.0.0.1:8000');
const serverUrl = new URL(window.origin);

//区分是否生产环境
const apiPrefix = import.meta.env.DEV ? '':'/api'
const httpEndpoint = `${serverUrl.protocol}//${serverUrl.host}${apiPrefix}`;
export const wsEndpoint = `${
  serverUrl.protocol === 'https:' ? 'wss' : 'ws'
}://${serverUrl.host}${apiPrefix}`;
// 本地运行
// const httpEndpoint = `http://172.16.21.206:8000`;
// export const wsEndpoint = `${
//   serverUrl.protocol === 'https:' ? 'wss' : 'ws'
// }://172.16.21.206:8000`;

export const getProjectSettings = async () => {
  const res = await fetch(`${httpEndpoint}/project/settings`, {
    headers: {
      'content-type': 'application/json'
    },
    method: 'GET'
  });

  return res.json();
};

export const getCompletion = async (
  prompt: string,
  settings: ILLMSettings,
  userEnv = {}
) => {
  const res = await fetch(`${httpEndpoint}/completion`, {
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ prompt, settings, userEnv })
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const completion = await res.text();
  return completion;
};

export const getRole = async (
  chainlitServer: string,
  accessToken: string,
  projectId: string
) => {
  const res = await fetch(`${chainlitServer}/api/role`, {
    headers: {
      'content-type': 'application/json',
      Authorization: accessToken
    },
    method: 'POST',
    body: JSON.stringify({ projectId })
  });

  return res.json() as Promise<{ role: Role }>;
};
