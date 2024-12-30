import { createRootRoute } from '@tanstack/react-router';
import RootProvider from '../components/root-provider';

export const Route = createRootRoute({
  component: RootProvider,
});
