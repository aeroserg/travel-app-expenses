terraform {
  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = "~> 0.87"
    }
  }
}

provider "yandex" {
  service_account_key_file = "./service_key.json"
  cloud_id  = "b1g9pmjhm72ovsbssvg3"
  folder_id = "b1gptanpd7352kko4q2t"
  zone      = "ru-central1-b"
}

resource "yandex_vpc_network" "travel_app_network" {
  name = "travel-app-network"
}

resource "yandex_vpc_subnet" "travel_app_subnet" {
  name           = "travel-app-subnet"
  zone           = "ru-central1-a"
  network_id     = yandex_vpc_network.travel_app_network.id
  v4_cidr_blocks = ["10.0.0.0/24"]
}

resource "yandex_compute_instance" "vm" {
  name        = "autodeployment-vm-travel-app"
  platform_id = "standard-v1"
  zone        = "ru-central1-a"

  resources {
    cores  = 2
    memory = 4
  }

  boot_disk {
    auto_delete = true
    initialize_params {
      image_id = "fd84gg15m6kjdembasoq"
      size = 30 
      type = "network-hdd" 
    }
  }

  network_interface {
    subnet_id = yandex_vpc_subnet.travel_app_subnet.id
    nat       = true
  }

  metadata = {
    ssh-keys = "ubuntu:${file("~/.ssh/id_ed25519.pub")}"
    user-data = <<-EOT
              #cloud-config
              package_update: true
              packages:
                - docker.io
              runcmd:
                - [ systemctl, enable, docker ]
                - [ systemctl, start, docker ]
            EOT
  }
}
