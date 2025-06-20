import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
	title: string;
	Svg: React.ComponentType<React.ComponentProps<'svg'>>;
	description: ReactNode;
};

const FeatureList: FeatureItem[] = [
	{
		title: 'Instant Project Setup',
		Svg: require('@site/static/img/undraw_outer-space_qey5.svg').default,
		description: (
			<>
				Jetup lets you scaffold a modern JavaScript or TypeScript project in seconds with a single
				command. No more manual setup—just code instantly!
			</>
		),
	},
	{
		title: 'Fully Modular & Customizable',
		Svg: require('@site/static/img/undraw_control-panel_j1wf.svg').default,
		description: (
			<>
				Choose from a library of presets or create your own. Jetup’s modular architecture means you
				can tailor your project setup to fit any workflow or stack.
			</>
		),
	},
	{
		title: 'Ready for Productivity',
		Svg: require('@site/static/img/undraw_dev-productivity_5wps.svg').default,
		description: (
			<>
				Jetup comes with best practices out of the box: ESLint, Prettier, Husky, Jest, and more.
				Start building immediately with a production-ready foundation.
			</>
		),
	},
];

function Feature({ title, Svg, description }: FeatureItem) {
	return (
		<div className={clsx('col col--4')}>
			<div className="text--center">
				<Svg className={styles.featureSvg} role="img" />
			</div>
			<div className="text--center padding-horiz--md">
				<Heading as="h3">{title}</Heading>
				<p>{description}</p>
			</div>
		</div>
	);
}

export default function HomepageFeatures(): ReactNode {
	return (
		<section className={styles.features}>
			<div className="container">
				<div className="row">
					{FeatureList.map((props, idx) => (
						<Feature key={idx} {...props} />
					))}
				</div>
			</div>
		</section>
	);
}
