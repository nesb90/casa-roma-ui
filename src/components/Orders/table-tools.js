import React from "react";
import { ORDER_STATUSES, FILTERS } from "../../config";

function TableTools(props) {
	const {
		getDefaultFilter,
		setFilter,
		setState,
		refresh
	} = props;

	const getOrders = function (filter) {
		setFilter(filter);
		setState((s) => ({ ...s, refresh: refresh + 1 }));
	};

	return (
		<div>
			<div className="col-2">
				<div className='input-group'>
					<div className="input-group-text"><i className="fa-solid fa-eye" aria-label="ver"></i></div>
					<select id='filter-list' className='form-control' onChange={(e) => getOrders(e.target.value)}>
						<option value={getDefaultFilter()}>Todas</option>
						{
							Object.keys(ORDER_STATUSES).map((status => (
								<option value={status}>{FILTERS[status]}</option>
							)))
						}
					</select>
				</div>
			</div>
		</div>
	);
};

export default TableTools;
