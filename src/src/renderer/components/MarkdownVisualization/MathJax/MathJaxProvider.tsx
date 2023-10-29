import {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';
import { mathjax } from 'mathjax-full/js/mathjax';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import type { MathDocument } from 'mathjax-full/js/core/MathDocument';
import type { LiteElement } from 'mathjax-full/js/adaptors/lite/Element';
import type { LiteText } from 'mathjax-full/js/adaptors/lite/Text';
import type { LiteDocument } from 'mathjax-full/js/adaptors/lite/Document';

export type Document = MathDocument<LiteElement, LiteText, LiteDocument>;

const MathJaxProviderContext = createContext<MathJaxProviderProps | undefined>(
	undefined
);

interface MathJaxProviderProps {
	document: Document | undefined;
}

export type Props = {
	children: ReactNode;
};

export default function MarkdownParserProvider(props: Props) {
	const [document, setDocument] = useState<Document>();
	const { children } = props;

	function initDocument(): Document {
		return mathjax.document('', {
			InputJax: new TeX({ packages: AllPackages }),
			OutputJax: new SVG({ fontCache: 'local' }),
		});
	}

	useEffect(() => {
		RegisterHTMLHandler(liteAdaptor());
		setDocument(initDocument());
	}, []);

	return (
		<MathJaxProviderContext.Provider value={{ document }}>
			{children}
		</MathJaxProviderContext.Provider>
	);
}

export const useMathJaxProvider = () => useContext(MathJaxProviderContext);
