import unittest

from app import create_app


class AuthCorsTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_login_allows_frontend_origin(self):
        response = self.client.post(
            '/api/v1/auth/login',
            json={'username': 'admin', 'password': 'admin123'},
            headers={'Origin': 'http://127.0.0.1:5173'}
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn('Access-Control-Allow-Origin', response.headers)
        self.assertEqual(response.headers['Access-Control-Allow-Origin'], 'http://127.0.0.1:5173')


if __name__ == '__main__':
    unittest.main()
