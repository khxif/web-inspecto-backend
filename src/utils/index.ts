import config from '../config/config.js';

export async function getRuns(eventId: string) {
  const response = await fetch(`${config.inngestApiUrl}/events/${eventId}/runs`, {
    headers: {
      Authorization: `Bearer ${config.inngestSigningKey}`,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Inngest API Error: ${response.status} ${errorText}`);
  }

  const json = await response.json();

  return json.data;
}
export async function getRunOutput(eventId: string) {
  let runs = await getRuns(eventId);

  while (runs[0].status !== 'Completed') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    runs = await getRuns(eventId);

    if (runs[0].status === 'Failed' || runs[0].status === 'Cancelled') {
      throw new Error(`Function run ${runs[0].status}`);
    }
  }

  return runs[0];
}
