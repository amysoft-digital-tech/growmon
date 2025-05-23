# Growmon - Seed to Harvest Management

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Angular](https://img.shields.io/badge/Angular-18-red.svg)](https://angular.io/)
[![Ionic](https://img.shields.io/badge/Ionic-Framework-blue.svg)](https://ionicframework.com/)

## Overview

Growmon is a comprehensive mobile application built with Ionic and Angular 18, designed to assist growers in managing the entire lifecycle of plant cultivation from seed to harvest. Whether you're a hobbyist or a commercial grower, Growmon provides tools to track, monitor, and optimize each stage of your plant's growth journey.

## Purpose

The primary goal of Growmon is to streamline the complex process of plant cultivation by offering a user-friendly interface to manage tasks, monitor progress, and maintain an inventory of resources. By digitizing these processes, Growmon helps reduce errors, improve efficiency, and ensure optimal growth conditions.

## Seed to Harvest Management

Growmon organizes the cultivation process into distinct stages, each represented by dedicated components within the application. Below is a summary of how Growmon supports seed to harvest management:

### 1. **Germination**
   - **Component**: `GerminationComponent`
   - **Purpose**: Track the initial stage of seed sprouting. Log details such as seed type, germination method, start date, and environmental conditions.
   - **Features**: Record germination success rates, set reminders for watering or light adjustments, and view progress updates.

### 2. **Clones**
   - **Component**: `ClonesComponent`
   - **Purpose**: Manage the propagation of plants through cloning. Document parent plants, cutting dates, and rooting progress.
   - **Features**: Track clone health, assign identifiers, and schedule transplanting.

### 3. **Starts**
   - **Component**: `StartsComponent`
   - **Purpose**: Oversee young plants or seedlings as they establish roots and begin vegetative growth.
   - **Features**: Monitor light, nutrient, and water schedules, and log growth metrics.

### 4. **Grows**
   - **Component**: `GrowsComponent`
   - **Purpose**: Manage the vegetative and flowering stages of plant growth in various growing environments.
   - **Features**: Track environmental data (temperature, humidity), adjust feeding schedules, and note pest or disease issues.

### 5. **Lots**
   - **Component**: `LotsComponent`
   - **Purpose**: Organize plants into batches or lots for easier management, especially useful for larger operations.
   - **Features**: Assign lot numbers, track lot-specific data, and manage inventory per lot.

### 6. **Harvests**
   - **Component**: `HarvestsComponent`
   - **Purpose**: Record details of the harvesting process, including yield, quality, and timing.
   - **Features**: Log harvest dates, weights, and conditions, and prepare for post-harvest processes.

### 7. **Drying**
   - **Component**: `DryingComponent`
   - **Purpose**: Manage the drying phase post-harvest to preserve quality and prepare for storage or curing.
   - **Features**: Monitor drying environment (temperature, humidity), set drying durations, and track progress.

### 8. **Curing**
   - **Component**: `CuringComponent`
   - **Purpose**: Oversee the curing process to enhance flavor, potency, and shelf life of the harvested product.
   - **Features**: Track curing conditions, durations, and jar rotations, and log final quality assessments.

### 9. **Inventory Management**
   - **Component**: `InventoryComponent` (with sub-components for details, additions, and modifications)
   - **Purpose**: Keep a detailed record of all resources, including seeds, clones, harvested products, and supplies.
   - **Features**: Add new items, modify existing records, view detailed item information, and manage stock levels.

## Additional Features

- **Dashboard**: A centralized view (`DashboardComponent`) to get quick insights into active grows, upcoming tasks, and critical alerts.
- **Authentication**: Secure login and registration system (`LoginComponent`, `SignUpComponent`, `ForgotPasswordComponent`) to protect user data and provide personalized experiences.

## Getting Started

To get started with Growmon:

1. **Clone the Repository**: `git clone <repository-url>`
2. **Install Dependencies**: `npm install`
3. **Run the Application**: `ionic serve` or `ng serve`
4. **Access the App**: Open your browser at `http://localhost:8100` or the port specified in your setup.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For support or inquiries, please reach out to the development team or open an issue on the GitHub repository.