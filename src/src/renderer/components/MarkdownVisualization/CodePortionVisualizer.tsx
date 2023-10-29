import { useMemo } from 'react';

export interface CodePortionVisualizerProps {
	code: string;
}

export default function CodePortionVisualizer(
	props: CodePortionVisualizerProps
) {
	const { code } = props;

	const memoCode = useMemo(() => code, [code]);

	// eslint-disable-next-line react/no-danger
	return <div dangerouslySetInnerHTML={{ __html: memoCode }} />;
}
