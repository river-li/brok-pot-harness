"""Network configuration is supplied privately; examples here are fixtures only."""
import importlib.util
from pathlib import Path
import unittest
spec = importlib.util.spec_from_file_location('network_config', Path(__file__).parents[1] / 'firecracker/network-config.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class NetworkConfigTests(unittest.TestCase):
    def settings(self):
        return dict(host_cidr='10.60.0.1/30', namespace_cidr='10.60.0.2/30',
                    guest_cidr='10.60.1.2/30', gateway_cidr='10.60.1.1/30',
                    dns_ipv4=['1.1.1.1', '8.8.8.8'], guest_mac='02:00:00:00:00:02')

    def test_validated_peer_routes(self):
        values = module.variables(self.settings())
        self.assertEqual(values['FC_GUEST_SUBNET'], '10.60.1.0/30')
        self.assertEqual(values['FC_HOST_IP'], '10.60.0.1')

    def test_overlap_injection_and_non_peer_addresses_are_rejected(self):
        for change in ({'guest_cidr':'10.60.0.2/30','gateway_cidr':'10.60.0.1/30'},
                       {'guest_cidr':'127.0.0.1/30'}, {'host_cidr':'10.60.0.0/30'},
                       {'guest_mac':'02:00:00:00:00:02; echo unsafe'},
                       {'dns_ipv4':['127.0.0.1','8.8.8.8']}):
            with self.assertRaises(ValueError):
                module.variables({**self.settings(), **change})
