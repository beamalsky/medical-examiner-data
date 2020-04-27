GENERATED_FILES = src/data/cases.json src/data/cases.geojson src/data/community_areas_cases.geojson src/data/unjoined_cases.geojson

all: $(GENERATED_FILES)

.PHONY:
clean:
	rm -f $(GENERATED_FILES)

src/data/unjoined_cases.geojson: src/data/chicago_community_areas.geojson src/data/cases.geojson
	mapshaper -i $(filter-out $<,$^) \
	-join $< calc 'value = count()' \
	-filter 'value === 0' \
	-filter-fields casenumber \
	-o $@

src/data/community_areas_cases.geojson: src/data/chicago_community_areas.geojson src/data/cases.geojson
	mapshaper -i $< \
	-join $(filter-out $<,$^) calc 'value = count()' \
	-filter-fields community,population,value \
	-o $@

src/data/cases.geojson: src/data/cases.json
	mapshaper -i $< \
	-points x=longitude y=latitude \
	-each 'combined_cause = [primarycause, primarycause_linea, primarycause_lineb].join("")' \
	-filter 'death_date > "2020-01-01" && !!residence_city && residence_city.toLowerCase().trim() === "chicago" && combined_cause.includes("COVID")' \
	-o $@

src/data/cases.json:
	wget -O $@ 'https://datacatalog.cookcountyil.gov/resource/cjeq-bs86.json?$$limit=100000'
