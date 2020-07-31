import sys
import json
import datetime
from collections import Counter, OrderedDict


class OrderedCounter(Counter, OrderedDict):
     'Counter that remembers the order elements are first seen'
     def __repr__(self):
         return '%s(%r)' % (self.__class__.__name__,
                            OrderedDict(self))
     def __reduce__(self):
         return self.__class__, (OrderedDict(self),)


if __name__ == '__main__':
    input = sys.argv[1]

    with open(input) as input_file:
        data = json.load(input_file)

        dates = []

        for p in data:
            date = datetime.datetime.strptime(
                p['death_date'], '%Y-%m-%dT%H:%M:%S.%f'
            ).date()

            dates.append(date)

        dates.sort()
        date_counts = OrderedCounter(dates)

        cumulative_count = 0
        for date in date_counts:
            cumulative_count += date_counts[date]
            print(str(date) + ',' + str(cumulative_count))
