import Filter from "../components/filter";
import {render, replace, RenderPosition} from "../utils/render.js";
import {FilterType} from "../const";
import {getMoviesByFilter} from "../utils/filter.js";

export default class FilterController {
  constructor(container, movieModel) {
    this._container = container;
    this._movieModel = movieModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;
    this._statiscticHandler = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.setStatisticHandler = this.setStatisticHandler.bind(this);

    this._movieModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allFilmCards = this._movieModel.getFilmCardsAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getMoviesByFilter(allFilmCards, filterType).length,
        active: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new Filter(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);
    this._filterComponent.setStatisticsClickHandler(this._statiscticHandler);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.AFTERBEGIN);
    }
  }

  getFilterComponent() {
    return this._filterComponent;
  }

  _onFilterChange(filterType) {
    this._movieModel.setFilter(filterType);
    this._activeFilterType = filterType;
    this.render();
  }

  setStatisticHandler(handler) {
    this._statiscticHandler = handler;
  }

  _onDataChange() {
    this.render();
  }
}
