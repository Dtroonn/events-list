import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";

ReactDOM.render(
	<LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
		<App />
	</LocalizationProvider>,

	document.getElementById("root")
);
