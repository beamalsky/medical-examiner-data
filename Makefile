GENERATED_FILES = src/data/cases_filtered.geojson src/data/cases_filtered.json src/data/community_areas_cases.geojson src/data/unjoined_cases.json
CASE_FILE = src/data/cases.json

all: $(GENERATED_FILES)

.PHONY:
clean:
	rm -f $(GENERATED_FILES) $(CASE_FILE)

src/data/unjoined_cases.json: src/data/chicago_community_areas.geojson src/data/cases_filtered.geojson
	mapshaper -i $(filter-out $<,$^) \
	-join $< calc 'value = count()' \
	-filter 'value === 0' \
	-filter-fields casenumber \
	-o $@ format=json

src/data/community_areas_cases.geojson: src/data/chicago_community_areas.geojson src/data/cases_filtered.geojson
	mapshaper -i $< \
	-join $(filter-out $<,$^) calc 'value = count()' \
	-filter-islands min-area=1km2 \
	-filter-fields population,community,value \
	-o $@ format=geojson

src/data/cases_filtered.geojson: src/data/cases.json
	mapshaper -i $< \
	-points x=longitude y=latitude \
	-each 'combined_cause = [primarycause, primarycause_linea, primarycause_lineb, primarycause_linec, secondarycause].join("")' \
	-filter 'death_date > "2020-01-01" && !!residence_city && residence_city.toLowerCase().trim() === "chicago" && combined_cause.toLowerCase().includes("covid")' \
	-o $@ format=geojson

src/data/cases_filtered.json: src/data/cases.json
	mapshaper -i $< \
	-points x=longitude y=latitude \
	-each 'combined_cause = [primarycause, primarycause_linea, primarycause_lineb, primarycause_linec, secondarycause].join("")' \
	-filter 'death_date > "2020-01-01" && !!residence_city && residence_city.toLowerCase().trim() === "chicago" && combined_cause.toLowerCase().includes("covid")' \
	-o $@ format=json

src/data/cases.json:
	wget -O $@ 'https://datacatalog.cookcountyil.gov/resource/cjeq-bs86.json?$$limit=100000'
