import React from "react";

function TableTools (props) {
	const {
		getDefaultFilters,
		setFilters,
		setState,
		refresh
	} = props;

	const setFilter = function (value) {
		const filters = getDefaultFilters();
		if (value) {
			filters[value] = true;
		};
		setFilters(filters);
		setState((s) => ({ ...s, refresh: refresh + 1 }));
	};

	return (
		<div>
			<div className="col-2">
				<div className='input-group'>
					<div className="input-group-text"><i className="fa-solid fa-eye" aria-label="ver"></i></div>
					<select id='filter-list' className='form-control' onChange={(e) => setFilter(e.target.value)}>
						<option value={false}>Todas</option>
						<option value='completed'>Completadas</option>
						<option value='cancelled'>Canceladas</option>
					</select>
				</div>
			</div>
		</div>
	);
};

export default TableTools;
