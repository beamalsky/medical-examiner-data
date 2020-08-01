GENERATED_FILES = src/data/final/community_areas.geojson src/data/final/cases.json \
src/data/final/community_areas_recent.geojson \
src/data/final/community_areas_march.geojson \
src/data/final/community_areas_april.geojson \
src/data/final/community_areas_may.geojson \
src/data/final/community_areas_june.geojson \
src/data/final/community_areas_july.geojson
CASE_FILE = src/data/cases.json
OFFSET ?= -21d
RECENT := $(shell date -v $(OFFSET) +%Y-%m-%d)

all: $(GENERATED_FILES)

.INTERMEDIATE: src/data/cases_filtered.geojson

.PHONY:
clean:
	rm src/data/intermediate/* src/data/final/* $(CASE_FILE)

src/data/intermediate/cases_filtered_march.geojson: src/data/intermediate/cases_filtered.geojson
	mapshaper -i $< \
	-filter 'death_date >= "2020-03-01" && death_date <= "2020-03-31"' \
	-o $@ format=geojson prettify

src/data/intermediate/cases_filtered_april.geojson: src/data/intermediate/cases_filtered.geojson
	mapshaper -i $< \
	-filter 'death_date >= "2020-04-01" && death_date <= "2020-04-30"' \
	-o $@ format=geojson prettify

src/data/intermediate/cases_filtered_may.geojson: src/data/intermediate/cases_filtered.geojson
	mapshaper -i $< \
	-filter 'death_date >= "2020-05-01" && death_date <= "2020-05-31"' \
	-o $@ format=geojson prettify

src/data/intermediate/cases_filtered_june.geojson: src/data/intermediate/cases_filtered.geojson
	mapshaper -i $< \
	-filter 'death_date >= "2020-06-01" && death_date <= "2020-06-30"' \
	-o $@ format=geojson prettify

src/data/intermediate/cases_filtered_july.geojson: src/data/intermediate/cases_filtered.geojson
	mapshaper -i $< \
	-filter 'death_date >= "2020-07-01" && death_date <= "2020-07-31"' \
	-o $@ format=geojson prettify

src/data/final/community_areas_march.geojson: src/data/chicago_community_areas.geojson src/data/intermediate/cases_filtered_march.geojson
	mapshaper -i $< \
	-join $(filter-out $<,$^) calc 'value = count()' \
	-filter-islands min-area=1km2 \
	-filter-fields population,community,value \
	-o $@ format=geojson

src/data/final/community_areas_april.geojson: src/data/chicago_community_areas.geojson src/data/intermediate/cases_filtered_april.geojson
	mapshaper -i $< \
	-join $(filter-out $<,$^) calc 'value = count()' \
	-filter-islands min-area=1km2 \
	-filter-fields population,community,value \
	-o $@ format=geojson

src/data/final/community_areas_may.geojson: src/data/chicago_community_areas.geojson src/data/intermediate/cases_filtered_may.geojson
	mapshaper -i $< \
	-join $(filter-out $<,$^) calc 'value = count()' \
	-filter-islands min-area=1km2 \
	-filter-fields population,community,value \
	-o $@ format=geojson

src/data/final/community_areas_june.geojson: src/data/chicago_community_areas.geojson src/data/intermediate/cases_filtered_june.geojson
	mapshaper -i $< \
	-join $(filter-out $<,$^) calc 'value = count()' \
	-filter-islands min-area=1km2 \
	-filter-fields population,community,value \
	-o $@ format=geojson

src/data/final/community_areas_july.geojson: src/data/chicago_community_areas.geojson src/data/intermediate/cases_filtered_july.geojson
	mapshaper -i $< \
	-join $(filter-out $<,$^) calc 'value = count()' \
	-filter-islands min-area=1km2 \
	-filter-fields population,community,value \
	-o $@ format=geojson

src/data/intermediate/cases_cumulative.csv : src/data/final/cases.json
	python src/data/scripts/cumulative_cases.py $< > $@




src/data/final/cases.json: src/data/intermediate/cases_filtered.geojson src/data/chicago_community_areas.geojson
	mapshaper -i $< \
	-join $(filter-out $<,$^) \
	-filter-fields casenumber,death_date,race,latino,community \
	-o $@ format=json prettify

src/data/final/community_areas.geojson: src/data/chicago_community_areas.geojson src/data/intermediate/cases_filtered.geojson
	mapshaper -i $< \
	-join $(filter-out $<,$^) calc 'value = count()' \
	-filter-islands min-area=1km2 \
	-filter-fields population,community,value \
	-o $@ format=geojson

src/data/final/community_areas_recent.geojson: src/data/chicago_community_areas.geojson src/data/intermediate/cases_filtered_recent.geojson
	mapshaper -i $< \
	-join $(filter-out $<,$^) calc 'value = count()' \
	-filter-islands min-area=1km2 \
	-filter-fields population,community,value \
	-o $@ format=geojson

src/data/intermediate/cases_filtered_recent.geojson: src/data/cases.json
	mapshaper -i $< \
	-points x=longitude y=latitude \
	-each 'combined_cause = [primarycause, primarycause_linea, primarycause_lineb, primarycause_linec, secondarycause].join("")' \
	-filter 'death_date > "$(RECENT)" && !!residence_city && residence_city.toLowerCase().trim() === "chicago" && combined_cause.toLowerCase().includes("covid")' \
	-o $@ format=geojson

src/data/intermediate/cases_filtered.geojson: src/data/cases.json
	mapshaper -i $< \
	-points x=longitude y=latitude \
	-each 'combined_cause = [primarycause, primarycause_linea, primarycause_lineb, primarycause_linec, secondarycause].join("")' \
	-filter 'death_date > "2020-01-01" && !!residence_city && residence_city.toLowerCase().trim() === "chicago" && combined_cause.toLowerCase().includes("covid")' \
	-o $@ format=geojson

src/data/cases.json:
	wget -O $@ 'https://datacatalog.cookcountyil.gov/resource/cjeq-bs86.json?$$limit=100000'
