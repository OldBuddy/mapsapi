# -*- coding: utf-8 -*-
from classes.mapsapi_base_test import MapsAPIBaseTest
from config import config
from lode_runner.dataprovider import dataprovider
from classes.util import scripts
from classes.WAPI.dataWorker import FirmData
import classes.util.misc as misc
import classes.util.link_generator as links


class FirmCallout(MapsAPIBaseTest):
    """
    Тесты на сallout фирмы
    """
    @dataprovider([(
        config.aut['local'] + u'/base.html',
        54.980678320392336,
        82.89860486984254,
        141265770417218
    )
    ])
    def firm_name_test(self, url, lat, lng, firm_id):
        """
        Проверка заголовка фирмы
        1.Открываем калаут фирмы
        2.Проверяем заголовок
        """
        self.driver.get(url)
        self.page.map.wait_init()
        self.page.console(scripts.SetScripts.pan_to(lat, lng))
        self.page.console(scripts.SetScripts.set_zoom(17))
        self.page.map.center_click()
        self.page.build_callout.wait_present()
        self.page.build_callout.open_firm_list()
        self.page.build_callout.open_firm_by_id(firm_id)
        callout_text = self.page.firm_callout.header
        f = FirmData(firm_id)
        self.assertEqual(f.firm_name, callout_text)

    @dataprovider([(
        config.aut['local'] + u'/base.html',
        54.980678320392336,
        82.89860486984254,
        141265770417218
    )
    ])
    def firm_back_list_test(self, url, lat, lng, firm_id):
        """
        Проверка кнопки назад (в здании с мн. организаций)
        1.Открываем калаут фирмы
        2.Нажимаем назад
        3.Провираем наличие списка организаций
        """
        self.driver.get(url)
        self.page.map.wait_init()
        self.page.console(scripts.SetScripts.pan_to(lat, lng))
        self.page.console(scripts.SetScripts.set_zoom(17))
        self.page.map.center_click()
        self.page.build_callout.wait_present()
        self.page.build_callout.open_firm_list()
        self.page.build_callout.open_firm_by_index(1)
        self.page.firm_callout.back()
        self.assertTrue(self.page.firm_list.list_present())

    @dataprovider([(
        config.aut['local'] + u'/base.html',
        54.987722587459736,
        82.88787066936494
    )
    ])
    def firm_back_build_test(self, url, lat, lng):
        """
        Проверка кнопки назад (к зданию)
        1.Открываем калаут фирмы
        2.Нажимаем назад
        3.Провираем наличие колаута здания
        """
        self.driver.get(url)
        self.page.map.wait_init()
        self.page.console(scripts.SetScripts.pan_to(lat, lng))
        self.page.console(scripts.SetScripts.set_zoom(17))
        self.page.map.center_click()
        self.page.build_callout.wait_present()
        self.page.build_callout.open_firm_by_index(1)
        self.page.firm_callout.back()
        self.assertTrue(self.page.build_callout.is_visible)

    @dataprovider([(
        config.aut['local'] + u'/base.html',
        54.987722587459736,
        82.88787066936494,
    )
    ])
    def firm_route_to(self, url, lat, lng):
        """
        Проверка ссылки на проехать до
        1.Открываем калаут фирмы
        2.Проверяем атирибут ссылки "Проехать сюда"
        """
        self.driver.get(url)
        self.page.map.wait_init()
        self.page.console(scripts.SetScripts.pan_to(lat, lng))
        self.page.console(scripts.SetScripts.set_zoom(17))
        self.page.map.center_click()
        self.page.build_callout.wait_present()
        self.page.build_callout.open_firm_by_index(1)
        route = self.page.firm_callout.route_link

    @dataprovider([(
        config.aut['local'] + u'/base.html',
        54.980678320392336,
        82.89860486984254,
        141265770417218
    )
    ])
    def firm_photo_test(self, url, lat, lng, firm_id):
        """
        Проверка наличия фото у фирмы
        1.Открыть фирму с фото
        2.Проверить наличие ссылки
        3.Проверить url ссылки
        4.Проверить количество фото
        """
        self.driver.get(url)
        self.page.map.wait_init()
        self.page.console(scripts.SetScripts.pan_to(lat, lng))
        self.page.console(scripts.SetScripts.set_zoom(17))
        self.page.map.center_click()
        self.page.build_callout.wait_present()
        self.page.build_callout.open_firm_list()
        self.page.build_callout.open_firm_by_id(firm_id)
        photo = self.page.firm_callout.photo
        self.assertTrue(photo.is_displayed())
        f = FirmData(firm_id)
        num = misc.to_int(photo.text)
        self.assertEqual(len(f.photos), num)
        link = links.photo_link(firm_id)
        self.assertEqual(link, photo.get_attribute('href'))

    @dataprovider([(
        config.aut['local'] + u'/base.html',
        54.980678320392336,
        82.89860486984254,
        141265771060872
    )
    ])
    def firm_rating_test(self, url, lat, lng, firm_id):
        """
        Проверка наличия рейтинга у фирмы
        1.Открыть фирму с рейтингом
        2.Проверить наличие рейтинга
        3.Проверить url ссылки
        4.Проверить количество отзывов
        """
        self.driver.get(url)
        self.page.map.wait_init()
        self.page.console(scripts.SetScripts.pan_to(lat, lng))
        self.page.console(scripts.SetScripts.set_zoom(17))
        self.page.map.center_click()
        self.page.build_callout.wait_present()
        self.page.build_callout.open_firm_list()
        self.page.build_callout.open_firm_by_id(firm_id)
        stars = self.page.firm_callout.stars
        reviews = self.page.firm_callout.reviews
        f = FirmData(firm_id)
        self.assertTrue(stars.is_displayed())
        self.assertEqual(reviews.get_attribute('href'), links.reviews_link(firm_id))
        reviews_count = misc.to_int(reviews.text)
        self.assertEqual(reviews_count, f.review_count)

    @dataprovider([(
        config.aut['local'] + u'/base.html',
        54.98271154250782,
        82.88130998611452,
        141265769373564
    )
    ])
    def firm_address_test(self, url, lat, lng, firm_id):
        """
        Проверка наличия адреса
        1.Открыть фирму
        2.Проверить наличие адреса
        3.Проверить адрес
        """
        self.driver.get(url)
        self.page.map.wait_init()
        self.page.console(scripts.SetScripts.pan_to(lat, lng))
        self.page.console(scripts.SetScripts.set_zoom(17))
        self.page.map.center_click()
        self.page.build_callout.wait_present()
        self.page.build_callout.open_firm_list()
        self.page.build_callout.open_firm_by_id(firm_id)
        f = FirmData(firm_id)
        self.assertTrue(self.page.firm_callout.address.is_displayed())
        self.assertEqual(self.page.firm_callout.address.text, f.address_name)

    @dataprovider([(
        config.aut['local'] + u'/base.html',
        54.980678320392336,
        82.89860486984254,
        141265771060872
    )
    ])
    def firm_address_comment_test(self, url, lat, lng, firm_id):
        """
        Проверка наличия комментария к адресу
        1.Открыть фирму с комментарием
        2.Праверить наличие комментария
        """
        self.driver.get(url)
        self.page.map.wait_init()
        self.page.console(scripts.SetScripts.pan_to(lat, lng))
        self.page.console(scripts.SetScripts.set_zoom(17))
        self.page.map.center_click()
        self.page.build_callout.wait_present()
        self.page.build_callout.open_firm_list()
        self.page.build_callout.open_firm_by_id(firm_id)
        f = FirmData(firm_id)
        self.assertTrue(self.page.firm_callout.address.is_displayed())
        full_adress = misc.address_and_comment(f.address_name, f.address_comment)
        self.assertEqual(self.page.firm_callout.address.text, full_adress)

    @dataprovider([(
        config.aut['local'] + u'/base.html',
        54.980678320392336,
        82.89860486984254,
        141265771060872
    ), (
        config.aut['local'] + u'/base.html',
        54.9810307939813,
        82.87442207336427,
        141265769728580
    )
    ])
    def firm_telephone_count(self, url, lat, lng, firm_id):
        """
        Проверка наличия и количества телефонов
        1.Открывем фирму
        2.Получаем количество телефонов (из API)
        3.Проверяем количество телефонов
        """
        self.driver.get(url)
        self.page.map.wait_init()
        self.page.console(scripts.SetScripts.pan_to(lat, lng))
        self.page.console(scripts.SetScripts.set_zoom(17))
        self.page.map.center_click()
        self.page.build_callout.wait_present()
        self.page.build_callout.open_firm_list()
        self.page.build_callout.open_firm_by_id(firm_id)
        f = FirmData(firm_id)
        phones_wapi = f.get_phones()
        phones_num = len(phones_wapi)
        phones_callout = self.page.firm_callout.phones()
        self.assertEqual(phones_num, len(phones_callout))

    @dataprovider([(
        config.aut['local'] + u'/base.html',
        54.980678320392336,
        82.89860486984254,
        141265771060872
    )
    ])
    def firm_telephone_comment_test(self, url, lat, lng, firm_id):
        """
        Проверка наличия комментария к телефону
        1.Открываем фирму
        2.Проверяем наличия комментария к телефону
        """
        self.driver.get(url)
        self.page.map.wait_init()
        self.page.console(scripts.SetScripts.pan_to(lat, lng))
        self.page.console(scripts.SetScripts.set_zoom(17))
        self.page.map.center_click()
        self.page.build_callout.wait_present()
        self.page.build_callout.open_firm_list()
        self.page.build_callout.open_firm_by_id(firm_id)
        f = FirmData(firm_id)
        phones_wapi = f.get_phones()
        phones_callout = self.page.firm_callout.phones()
        phone_and_comment = misc.phone_and_comment(phones_wapi[0]['text'], phones_wapi[0]['comment'])
        self.assertEqual(phones_callout[0].text, phone_and_comment)

    @dataprovider([(
        config.aut['local'] + u'/base.html',
        54.980678320392336,
        82.89860486984254,
        141265770417218
    ), (
        config.aut['local'] + u'/base.html',
        54.980678320392336,
        82.89860486984254,
        141265770847007
    )
    ])
    def firm_website_count_test(self, url, lat, lng, firm_id):
        """
        Проверка наличия ссылки на вебсайт
        1.Открываем фирму
        2.Проверяем наличие ссылки на вебсайт
        3.Проверяем количество ссылок
        """
        self.driver.get(url)
        self.page.map.wait_init()
        self.page.console(scripts.SetScripts.pan_to(lat, lng))
        self.page.console(scripts.SetScripts.set_zoom(17))
        self.page.map.center_click()
        self.page.build_callout.wait_present()
        self.page.build_callout.open_firm_list()
        self.page.build_callout.open_firm_by_id(firm_id)
        f = FirmData(firm_id)
        websites_wapi = f.get_websites()
        websites_callout = self.page.firm_callout.websites()
        self.assertEqual(len(websites_callout), len(websites_wapi))
        self.assertEqual(websites_callout[0].text, websites_wapi[0]['text'])

    def firm_email(self):
        """
        Проверка наличия email
        1.Открываем фирму
        2.Проверяем наличие email
        3.Проверяем ссыль на мейл
        """
        pass

    # для простого, списка и таблицы
    def firm_schedule(self):
        """
        Проверка наличия расписания
        1.Открываем фирму
        2.Проверяем наличие расписания
        3.Проверяем наличие подсказки
        """
        pass

    def firm_schedule_wrapper_list(self):
        """
        Проверка расписания-списка
        1.Открываем фирму
        2.Проверяем расписание на сегодня (для всех языков)
        3.Кликаем в врапер
        4.Проверяем наличие списка
        5.Отсутсвие посдсказки на сегодня
        """
        pass

    def firm_schedule_wrapper_table(self):
        """
        Проверка расписания-таблицы
        1.Открываем фирму
        2.Проверяем расписание на сегодня (для всех языков)
        3.Кликаем в врапер
        4.Проверяем наличие таблицы
        5.Отсутсвие посдсказки на сегодня
        """
        pass

    def firm_rubrics(self):
        """
        Проверка рубрик
        1.Открываем фирму
        2.Проверяем количество рубрик
        3.Проверяем порядок(первая, последняя, в сеередине)
        """
        pass

    def firm_scroll_bar(self):
        """
        Проверка наличия скролл-бара
        1.Открываем фирму со скроллбаром
        2.Проверяем его наличия
        3.Проверяем высоту конетента (>300)
        """
        pass

    def firm_no_scroll_bar(self):
        """
        Проверка отсутсвия скролл-бара
        1.Открывем фирму без скролл бара
        2.Проверяем его отсутвие
        3.Проверяем высоту контента (< 300)
        """
        pass
