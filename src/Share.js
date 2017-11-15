import React from 'react';
import PropTypes from 'prop-types';
import {
	ShareButtons,
	ShareCounts,
	generateShareIcon
} from 'react-share';
import MyReadsImage from './icons/myreads.jpg';
import './App.css';

const {
	FacebookShareButton,
	GooglePlusShareButton,
	LinkedinShareButton,
	TwitterShareButton,
	PinterestShareButton,
	VKShareButton,
	OKShareButton,
	TelegramShareButton,
	WhatsappShareButton,
	RedditShareButton,
	EmailShareButton,
	TumblrShareButton,
} = ShareButtons;

const {
	FacebookShareCount,
	GooglePlusShareCount,
	LinkedinShareCount,
	PinterestShareCount,
	VKShareCount,
	OKShareCount,
	RedditShareCount,
	TumblrShareCount,
} = ShareCounts;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');
const LinkedinIcon = generateShareIcon('linkedin');
const PinterestIcon = generateShareIcon('pinterest');
const VKIcon = generateShareIcon('vk');
const OKIcon = generateShareIcon('ok');
const TelegramIcon = generateShareIcon('telegram');
const WhatsappIcon = generateShareIcon('whatsapp');
const RedditIcon = generateShareIcon('reddit');
const TumblrIcon = generateShareIcon('tumblr');
const EmailIcon = generateShareIcon('email');

/**
 *
 * @param props
 * @returns {XML}
 * @constructor
 */
function Share(props) {

	return (
		<div>
			<div className="share-network">
				<FacebookShareButton
					url={props.url}
					quote={props.title}
					className="share-network-share-button">
					<FacebookIcon
						size={32}
						round />
				</FacebookShareButton>

				<FacebookShareCount
					url={props.url}
					className="share-network-share-count">
					{count => count}
				</FacebookShareCount>
			</div>

			<div className="share-network">
				<TwitterShareButton
					url={props.url}
					title={props.title}
					className="share-network-share-button">
					<TwitterIcon
						size={32}
						round />
				</TwitterShareButton>

				<div className="share-network-share-count">
					&nbsp;
				</div>
			</div>

			<div className="share-network">
				<TelegramShareButton
					url={props.url}
					title={props.title}
					className="share-network-share-button">
					<TelegramIcon size={32} round />
				</TelegramShareButton>

				<div className="share-network-share-count">
					&nbsp;
				</div>
			</div>

			<div className="share-network">
				<WhatsappShareButton
					url={props.url}
					title={props.title}
					separator=":: "
					className="share-network-share-button">
					<WhatsappIcon size={32} round />
				</WhatsappShareButton>

				<div className="share-network-share-count">
					&nbsp;
				</div>
			</div>

			<div className="share-network">
				<GooglePlusShareButton
					url={props.url}
					className="share-network-share-button">
					<GooglePlusIcon
						size={32}
						round />
				</GooglePlusShareButton>

				<GooglePlusShareCount
					url={props.url}
					className="share-network-share-count">
					{count => count}
				</GooglePlusShareCount>
			</div>

			<div className="share-network">
				<LinkedinShareButton
					url={props.url}
					title={props.title}
					windowWidth={750}
					windowHeight={600}
					className="share-network-share-button">
					<LinkedinIcon
						size={32}
						round />
				</LinkedinShareButton>

				<LinkedinShareCount
					url={props.url}
					className="share-network-share-count">
					{count => count}
				</LinkedinShareCount>
			</div>

			<div className="share-network">
				<PinterestShareButton
					url={String(window.location)}
					media={`${String(window.location)}/${MyReadsImage}`}
					windowWidth={1000}
					windowHeight={730}
					className="share-network-share-button">
					<PinterestIcon size={32} round />
				</PinterestShareButton>

				<PinterestShareCount url={props.url}
									 className="share-network-share-count" />
			</div>

			<div className="share-network">
				<VKShareButton
					url={props.url}
					image={`${String(window.location)}/${MyReadsImage}`}
					windowWidth={660}
					windowHeight={460}
					className="share-network-share-button">
					<VKIcon
						size={32}
						round />
				</VKShareButton>

				<VKShareCount url={props.url}
							  className="share-network-share-count" />
			</div>

			<div className="share-network">
				<OKShareButton
					url={props.url}
					image={`${String(window.location)}/${MyReadsImage}`}
					windowWidth={660}
					windowHeight={460}
					className="share-network-share-button">
					<OKIcon
						size={32}
						round />
				</OKShareButton>

				<OKShareCount url={props.url}
							  className="share-network-share-count" />
			</div>

			<div className="share-network">
				<RedditShareButton
					url={props.url}
					title={props.title}
					windowWidth={660}
					windowHeight={460}
					className="share-network-share-button">
					<RedditIcon
						size={32}
						round />
				</RedditShareButton>

				<RedditShareCount url={props.url}
								  className="share-network-share-count" />
			</div>

			<div className="share-network">
				<TumblrShareButton
					url={props.url}
					title={props.title}
					windowWidth={660}
					windowHeight={460}
					className="share-network-share-button">
					<TumblrIcon
						size={32}
						round />
				</TumblrShareButton>

				<TumblrShareCount url={props.url}
								  className="share-network-share-count" />
			</div>

			<div className="share-network">
				<EmailShareButton
					url={props.url}
					subject={props.title}
					body="body"
					className="share-network-share-button">
					<EmailIcon
						size={32}
						round />
				</EmailShareButton>
			</div>
		</div>
	);
}

Share.propTypes = {
	// Title of the book
	title: PropTypes.string.isRequired,
	// Book Cover Image
	url: PropTypes.string.isRequired,
};

export default Share;