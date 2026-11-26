import type { Dispatch, SetStateAction, SyntheticEvent } from 'react';

export type PageUIProps = {
  isLoading?: boolean;
  redirectState?: unknown;
  errorText: string | undefined;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: SyntheticEvent) => void;
};
