const NotificationIcon = ({ data }: { data: boolean }) => {
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<g
				id="bell-top"
				transform="translate(4 4)">
				<path
					d="M3.26325 6.21594C3.54741 3.67712 5.60145 1.8 8 1.8C10.3985 1.8 12.4526 3.67712 12.7368 6.21594L13.0434 8.95595C13.1393 9.81208 13.4824 10.6209 14.0312 11.2748C14.493 11.8248 14.0728 12.6 13.4865 12.6H2.51348C1.92722 12.6 1.50702 11.8248 1.96877 11.2748C2.51764 10.6209 2.86074 9.81208 2.95657 8.95595L3.26325 6.21594Z"
					fill="currentColor"
					stroke="currentColor"
					stroke-width="3"
				/>
			</g>
			{data && (
				<g id="circle">
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M20 5C20 6.65685 18.6569 8 17 8C15.3431 8 14 6.65685 14 5C14 3.34315 15.3431 2 17 2C18.6569 2 20 3.34315 20 5Z"
						fill="#45AD6E"
					/>
				</g>
			)}
			<g id="bell-bottom">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M14.9721 20.0715C14.5147 21.1992 13.3565 22 12 22C10.6435 22 9.48526 21.1992 9.02789 20.0715C9.00883 20.0245 9 19.974 9 19.9233C9 19.6895 9.18951 19.5 9.42329 19.5H14.5767C14.8105 19.5 15 19.6895 15 19.9233C15 19.974 14.9912 20.0245 14.9721 20.0715Z"
					fill="currentColor"
				/>
			</g>
		</svg>
	);
};

export default NotificationIcon;
