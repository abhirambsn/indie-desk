import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../api-gateway/src/trpc/trpc.router';

export const trpc = createTRPCReact<AppRouter>();
