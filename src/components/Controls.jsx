import { Grid } from '@mui/material'

import Title from './Title'
import RotationSliders from './RotationSliders'
import TranslationControl from './TranslationControl'
import SampleDetectorFields from './SampleDetectorFields'

const Controls = ({
	rotation,
	setRotation,
	tilt,
	setTilt,
	translation,
	setTranslation,
	randomize,
	setRandomize,
}) => {
	return (
		<div className='controls'>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Title title='Rotation & Tilt' />
					<RotationSliders
						rotation={rotation}
						setRotation={setRotation}
						tilt={tilt}
						setTilt={setTilt}
					/>
				</Grid>
				<Grid item xs={12}>
					<Title title='Translation' />
					<TranslationControl
						translation={translation}
						setTranslation={setTranslation}
						randomize={randomize}
						setRandomize={setRandomize}
					/>
				</Grid>
				<SampleDetectorFields />
			</Grid>
		</div>
	)
}

export default Controls
