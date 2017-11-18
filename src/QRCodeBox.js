import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import RaisedButton from 'material-ui/RaisedButton';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';

/**
 * This object is used for type checking the props of the component.
 */
const propTypes = {
	value: PropTypes.string.isRequired,
};

/**
 * @description Represent the QR code component. It generate a QR Code image from a string passed via props
 * with a download button.
 * @constructor
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {string} props.value - The string to be converted to the QR code image box.
 */
class QRCodeBox extends React.Component {

	/**
	 * Lifecycle event handler called just after the App loads into the DOM.
	 * Setup the download QR code link converting svg to the image downloadable data.
	 */
	componentDidMount() {
		const app = this;
		const link = this.downloadButton;

		link.addEventListener('click', function (e) {
			// Convert the svg canvas to image data
			link.href = app.qrCanvas.refs.canvas.toDataURL();
		}, false);
	}

	render() {
		const {value} = this.props;

		return (
			<div>
				<QRCode
					ref={(qrCode) => {
						this.qrCanvas = qrCode;
					}}
					fgColor="#323266" size={240}
					value={value}
					logoWidth={48}
				/>
				<div>
					<a ref={(download) => {
						this.downloadButton = download;
					}}
					   download="myreads_account_backup.png"
					   target="_blank"
					>
						<RaisedButton
							label="Download QR Code"
							icon={<FileFileDownload/>}
						/>
					</a>
				</div>
			</div>
		);
	}
}

QRCodeBox.propTypes = propTypes;

export default QRCodeBox;