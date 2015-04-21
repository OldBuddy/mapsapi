from classes.WAPI.request import GeoSearch


class GeoData(object):
    def __init__(self, cords, zoom):
        request = GeoSearch()
        self.response = request.get(cords, zoom)

    def get_value_by_key(self, key_name, key_value, key_return):
        """
        :param key_name: Key name, that want use (example: 'subtype')
        :param key_value: Value that element with key_name should be equal (example: 'city')
        :param key_return: Key name that should be returned (example: 'name')
        :return: string or list (depends on field)
        """
        for elem in self.response['items']:
            if elem.get(key_name) == key_value:
                return elem.get(key_return)

    def city_name(self):
        return self.get_value_by_key('subtype', 'city', 'name')

    def district_name(self):
        return self.get_value_by_key('subtype', 'district', 'name')

    def district_address(self):
        adm_divs = self.get_value_by_key('subtype', 'district', 'adm_div')
        adm_divs.reverse()
        dist_addr = adm_divs.pop(0)['name']
        for div in adm_divs:
            dist_addr = dist_addr + ', ' + div['name']
        return dist_addr.replace(u'\xa0', ' ')

    def build_name(self):
        address_name = self.get_value_by_key('subtype', None, 'address_name')
        building_name = self.get_value_by_key('subtype', None, 'building_name')
        if building_name is None:
            return address_name
        else:
            return building_name
