GENERATED_FILES = src/data/final/community_areas.geojson \
src/data/final/cases.json src/data/intermediate/cases_filtered.geojson \
src/data/intermediate/cases_filtered_recent.geojson \
src/data/final/community_areas_recent.geojson
CASE_FILE = src/data/cases.json
OFFSET ?= -21d
RECENT := $(shell date -v $(OFFSET) +%Y-%m-%d)

all: $(GENERATED_FILES)

.INTERMEDIATE: src/data/cases_filtered.geojson

.PHONY:
clean:
	rm -f $(GENERATED_FILES) $(CASE_FILE)

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
