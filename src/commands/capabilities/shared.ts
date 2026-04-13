type CapabilityListItem = Record<string, unknown>;

type CapabilityListResponse = {
  data?: unknown;
};

type ExternalCapabilityExecutionBodyInput = {
  capabilityId: string;
  input: Record<string, unknown>;
  idempotencyKey: string;
  correlationId?: string;
};

export function mapCapabilityListRows(response: CapabilityListResponse): Array<Record<string, unknown>> | undefined {
  if (!Array.isArray(response.data)) return undefined;

  return (response.data as CapabilityListItem[]).map((item) => ({
    id: item.id,
    code: item.code || item.capabilityCode || item.serviceCode,
    name: item.name,
    status: item.status
  }));
}

export function buildExternalCapabilityExecutionBody(input: ExternalCapabilityExecutionBodyInput): Record<string, unknown> {
  return {
    capabilityCode: input.capabilityId,
    serviceCode: input.capabilityId,
    input: input.input,
    idempotencyKey: input.idempotencyKey,
    correlationId: input.correlationId
  };
}
